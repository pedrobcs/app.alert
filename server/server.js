// server.js - SafeAlert Twilio Backend Server
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');
const sqlite3 = require('sqlite3').verbose();
const util = require('util');
const morgan = require('morgan');

// Environment variables with defaults
const {
  PORT = 3001,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_WHATSAPP_FROM = 'whatsapp:+14155238886',
  TWILIO_FROM,
  FRONTEND_URL = 'http://localhost:3000',
  NODE_ENV = 'development'
} = process.env;

// Validate required Twilio credentials
if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
  console.error('❌ ERROR: TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set in .env file');
  console.error('Please copy .env.example to .env and add your Twilio credentials');
  process.exit(1);
}

// Initialize Twilio client
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

// ============================================================================
// Database Setup (SQLite)
// ============================================================================

const db = new sqlite3.Database('./data.db');

// Promisify database methods
db.runAsync = util.promisify(db.run.bind(db));
db.getAsync = util.promisify(db.get.bind(db));
db.allAsync = util.promisify(db.all.bind(db));

// Initialize database tables
async function initDb() {
  try {
    // Contacts table: stores emergency contacts
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        phone TEXT UNIQUE NOT NULL,
        opt_in INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Panic events table: stores each panic alert trigger
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS panic_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        meta TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Panic results table: stores delivery status for each contact
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS panic_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        panic_event_id INTEGER NOT NULL,
        contact_phone TEXT NOT NULL,
        status TEXT NOT NULL,
        sid TEXT,
        error TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(panic_event_id) REFERENCES panic_events(id)
      )
    `);

    console.log('✅ Database initialized successfully');
  } catch (err) {
    console.error('❌ Database initialization error:', err);
    process.exit(1);
  }
}

initDb();

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Normalize phone number to E.164 format
 */
function normalizePhone(phone) {
  if (!phone) return null;
  // Remove spaces, dashes, and parentheses
  let normalized = phone.replace(/[\s\-()]/g, '');
  
  // Ensure it starts with +
  if (!normalized.startsWith('+')) {
    // If it's a US number without country code, add +1
    if (normalized.length === 10) {
      normalized = '+1' + normalized;
    } else if (normalized.length > 10) {
      normalized = '+' + normalized;
    }
  }
  
  return normalized;
}

/**
 * Format address for concise display
 */
function formatConciseAddress(nominatimJson) {
  const a = nominatimJson && nominatimJson.address ? nominatimJson.address : {};
  const street = [a.house_number, a.road || a.pedestrian || a.footway].filter(Boolean).join(' ');
  const city = a.city || a.town || a.village || a.hamlet || a.county;
  const state = a.state || a.region || a.state_district;
  const zip = a.postcode;
  const parts = [street, city, state, zip].filter(Boolean);
  return parts.length ? parts.join(', ') : (nominatimJson.display_name || '');
}

/**
 * Reverse geocode coordinates using OpenStreetMap Nominatim
 */
async function reverseGeocode(lat, lon, opts = { countryBias: 'us', acceptLanguage: 'en' }) {
  try {
    const params = new URLSearchParams({
      format: 'jsonv2',
      lat: String(lat),
      lon: String(lon),
      addressdetails: '1',
    });
    
    if (opts.countryBias) {
      params.append('countrycodes', opts.countryBias);
    }
    
    const url = `https://nominatim.openstreetmap.org/reverse?${params.toString()}`;
    
    // Use native fetch (Node 18+) or import node-fetch if on older Node
    const fetch = global.fetch || require('node-fetch');
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SafeAlert/1.0',
        'Accept-Language': opts.acceptLanguage || 'en',
      }
    });
    
    if (!response.ok) {
      return { full: `${lat}, ${lon}`, short: `${lat}, ${lon}` };
    }
    
    const data = await response.json();
    return {
      full: data.display_name || `${lat}, ${lon}`,
      short: formatConciseAddress(data) || `${lat}, ${lon}`
    };
  } catch (err) {
    console.error('Reverse geocoding error:', err);
    return { full: `${lat}, ${lon}`, short: `${lat}, ${lon}` };
  }
}

// ============================================================================
// API Routes - Contacts CRUD
// ============================================================================

/**
 * Create a new contact
 * POST /contacts
 */
app.post('/contacts', async (req, res) => {
  const { name, phone, opt_in } = req.body;
  
  if (!phone) {
    return res.status(400).json({ 
      error: 'phone required (E.164 format e.g. +15085140864)' 
    });
  }
  
  const normalizedPhone = normalizePhone(phone);
  
  try {
    await db.runAsync(
      `INSERT OR IGNORE INTO contacts (name, phone, opt_in) VALUES (?, ?, ?)`,
      [name || null, normalizedPhone, opt_in ? 1 : 0]
    );
    
    const contact = await db.getAsync(
      `SELECT * FROM contacts WHERE phone = ?`,
      [normalizedPhone]
    );
    
    res.json({ contact });
  } catch (err) {
    console.error('Create contact error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get all contacts
 * GET /contacts
 */
app.get('/contacts', async (req, res) => {
  try {
    const contacts = await db.allAsync(
      `SELECT * FROM contacts ORDER BY created_at DESC`
    );
    res.json({ contacts });
  } catch (err) {
    console.error('Get contacts error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Update a contact
 * PUT /contacts/:id
 */
app.put('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  const { name, phone, opt_in } = req.body;
  
  try {
    const current = await db.getAsync(
      `SELECT * FROM contacts WHERE id = ?`,
      [id]
    );
    
    if (!current) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    const normalizedPhone = phone ? normalizePhone(phone) : current.phone;
    
    await db.runAsync(
      `UPDATE contacts SET name = ?, phone = ?, opt_in = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [
        name !== undefined ? name : current.name,
        normalizedPhone,
        opt_in !== undefined ? (opt_in ? 1 : 0) : current.opt_in,
        id
      ]
    );
    
    const updated = await db.getAsync(
      `SELECT * FROM contacts WHERE id = ?`,
      [id]
    );
    
    res.json({ contact: updated });
  } catch (err) {
    console.error('Update contact error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Delete a contact
 * DELETE /contacts/:id
 */
app.delete('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await db.runAsync(`DELETE FROM contacts WHERE id = ?`, [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete contact error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// API Routes - Panic Alert
// ============================================================================

/**
 * Send panic alert
 * POST /panic
 * 
 * Accepts:
 * {
 *   contacts: ["+15085140864", ...],  // Array of phone numbers
 *   contactIds: [1, 2, 3],            // OR array of contact IDs from DB
 *   message: "texto",                 // Optional custom message
 *   location: { lat, lng }            // GPS coordinates
 * }
 */
app.post('/panic', async (req, res) => {
  const { contacts, contactIds, message: customMessage, location, meta } = req.body;
  
  let phones = [];
  
  try {
    // Build target list from contact IDs
    if (Array.isArray(contactIds) && contactIds.length) {
      const placeholders = contactIds.map(() => '?').join(',');
      const rows = await db.allAsync(
        `SELECT phone FROM contacts WHERE id IN (${placeholders})`,
        contactIds
      );
      phones = rows.map(r => r.phone);
    }
    
    // Add direct phone numbers
    if (Array.isArray(contacts) && contacts.length) {
      phones = phones.concat(contacts.map(normalizePhone));
    }
    
    // Remove duplicates and filter empty values
    phones = Array.from(new Set(phones.filter(Boolean)));
    
    if (!phones.length) {
      return res.status(400).json({ error: 'No contacts provided' });
    }
    
    // Compose message
    const prefix = '🚨 ALERTA! O ICE ACABOU DE ME PEGAR. ';
    let message;
    
    if (location && location.lat && location.lng) {
      // Get human-readable address
      const geocode = await reverseGeocode(location.lat, location.lng, {
        countryBias: 'us',
        acceptLanguage: 'en'
      });
      
      const baseMessage = customMessage || `Preciso de ajuda! Estou em: ${geocode.short}`;
      message = `${prefix}${baseMessage}\n\n📍 Localização: https://maps.google.com/?q=${location.lat},${location.lng}`;
    } else {
      message = `${prefix}${customMessage || 'Preciso de ajuda urgente!'}`;
    }
    
    // Save panic event to database
    await db.runAsync(
      `INSERT INTO panic_events (message, latitude, longitude, meta) VALUES (?, ?, ?, ?)`,
      [
        message,
        location ? location.lat : null,
        location ? location.lng : null,
        meta ? JSON.stringify(meta) : null
      ]
    );
    
    const eventRow = await db.getAsync(`SELECT last_insert_rowid() as id`);
    const panicEventId = eventRow.id;
    
    // Send messages to all contacts
    const results = [];
    
    for (const phone of phones) {
      const to = `whatsapp:${phone}`;
      
      try {
        console.log(`📤 Sending WhatsApp to ${to}...`);
        
        const msg = await client.messages.create({
          from: TWILIO_WHATSAPP_FROM,
          to,
          body: message
        });
        
        // Save success result
        await db.runAsync(
          `INSERT INTO panic_results (panic_event_id, contact_phone, status, sid) VALUES (?, ?, ?, ?)`,
          [panicEventId, phone, 'sent', msg.sid]
        );
        
        results.push({ 
          phone, 
          status: 'sent', 
          sid: msg.sid 
        });
        
        console.log(`✅ Sent to ${phone}: ${msg.sid}`);
      } catch (err) {
        console.error(`❌ Failed to send to ${phone}:`, err.message);
        
        // Save error result
        await db.runAsync(
          `INSERT INTO panic_results (panic_event_id, contact_phone, status, error) VALUES (?, ?, ?, ?)`,
          [panicEventId, phone, 'failed', err.message]
        );
        
        results.push({ 
          phone, 
          status: 'failed', 
          error: err.message 
        });
      }
    }
    
    // Check if any messages were sent successfully
    const successCount = results.filter(r => r.status === 'sent').length;
    
    res.json({
      success: successCount > 0,
      panicEventId,
      message,
      results,
      summary: {
        total: results.length,
        sent: successCount,
        failed: results.length - successCount
      }
    });
  } catch (err) {
    console.error('Panic alert error:', err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// ============================================================================
// API Routes - SMS Alert (for PWA compatibility)
// ============================================================================

/**
 * Send SMS alert
 * POST /send-alert
 * 
 * Payload: 
 * {
 *   contacts: [{name, phone, message}],
 *   lat: number,
 *   lon: number
 * }
 */
app.post('/send-alert', async (req, res) => {
  try {
    const { contacts, lat, lon } = req.body;
    
    if (!Array.isArray(contacts) || contacts.length === 0) {
      return res.status(400).json({ 
        ok: false, 
        error: 'contacts array required' 
      });
    }
    
    if (lat == null || lon == null) {
      return res.status(400).json({ 
        ok: false, 
        error: 'lat and lon required' 
      });
    }
    
    if (!TWILIO_FROM) {
      return res.status(500).json({ 
        ok: false, 
        error: 'TWILIO_FROM not configured for SMS. Please set it in .env file' 
      });
    }
    
    // Get address
    const geocode = await reverseGeocode(lat, lon, {
      countryBias: 'us',
      acceptLanguage: 'en'
    });
    
    const results = [];
    
    for (const contact of contacts) {
      const name = contact.name || '';
      const phone = normalizePhone(contact.phone || '');
      
      if (!phone) {
        results.push({ 
          to: null, 
          status: 'failed', 
          error: 'missing phone' 
        });
        continue;
      }
      
      const baseMessage = contact.message || 
        `O ICE ACABOU DE ME PEGAR. Preciso de ajuda! Estou em: ${geocode.short}`;
      
      const text = baseMessage + `\n\n📍 Mapa: https://maps.google.com/?q=${lat},${lon}`;
      
      try {
        const msg = await client.messages.create({
          body: (name ? `Olá ${name}, ` : '') + text,
          from: TWILIO_FROM,
          to: phone
        });
        
        results.push({ 
          to: phone, 
          status: 'sent', 
          sid: msg.sid 
        });
      } catch (err) {
        results.push({ 
          to: phone, 
          status: 'failed', 
          error: err.message 
        });
      }
    }
    
    res.json({ 
      ok: true, 
      results, 
      address: geocode.short, 
      lat, 
      lon 
    });
  } catch (err) {
    console.error('Send alert error:', err);
    res.status(500).json({ 
      ok: false, 
      error: err.message 
    });
  }
});

// ============================================================================
// API Routes - Webhooks
// ============================================================================

/**
 * Webhook for incoming Twilio messages
 * POST /webhook/incoming
 * 
 * Set this URL in your Twilio Console:
 * "WHEN A MESSAGE COMES IN" -> https://your-server.com/webhook/incoming
 */
app.post('/webhook/incoming', bodyParser.urlencoded({ extended: false }), async (req, res) => {
  try {
    const from = req.body.From; // e.g., "whatsapp:+15085140864"
    const body = req.body.Body || '';
    
    console.log('📥 Incoming message from:', from, 'Body:', body);
    
    // Extract phone number
    const phone = (from || '').replace('whatsapp:', '');
    if (!phone) {
      return res.sendStatus(200);
    }
    
    const lower = body.trim().toLowerCase();
    
    // Handle opt-in
    if (lower.startsWith('join') || lower.includes('quero') || lower.includes('sim')) {
      // Create or update contact with opt-in
      await db.runAsync(
        `INSERT OR IGNORE INTO contacts (phone, opt_in) VALUES (?, 1)`,
        [phone]
      );
      await db.runAsync(
        `UPDATE contacts SET opt_in = 1, updated_at = CURRENT_TIMESTAMP WHERE phone = ?`,
        [phone]
      );
      
      // Send confirmation
      await client.messages.create({
        from: TWILIO_WHATSAPP_FROM,
        to: `whatsapp:${phone}`,
        body: '✅ Obrigado! Você está inscrito(a) para receber alertas de emergência.'
      });
      
      console.log(`✅ User ${phone} opted in`);
    }
    
    // Handle opt-out
    if (lower === 'stop' || lower === 'parar' || lower === 'sair') {
      await db.runAsync(
        `UPDATE contacts SET opt_in = 0, updated_at = CURRENT_TIMESTAMP WHERE phone = ?`,
        [phone]
      );
      
      await client.messages.create({
        from: TWILIO_WHATSAPP_FROM,
        to: `whatsapp:${phone}`,
        body: '❌ Você saiu dos alertas. Envie "join" para voltar a receber alertas.'
      });
      
      console.log(`❌ User ${phone} opted out`);
    }
    
    res.sendStatus(200);
  } catch (err) {
    console.error('Webhook error:', err);
    res.sendStatus(500);
  }
});

// ============================================================================
// API Routes - Health & Info
// ============================================================================

/**
 * Health check endpoint
 * GET /
 */
app.get('/', (req, res) => {
  res.json({
    ok: true,
    service: 'SafeAlert Backend',
    version: '1.0.0',
    env: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

/**
 * Get panic events history
 * GET /panic-events
 */
app.get('/panic-events', async (req, res) => {
  try {
    const events = await db.allAsync(
      `SELECT * FROM panic_events ORDER BY created_at DESC LIMIT 50`
    );
    res.json({ events });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get panic event details with results
 * GET /panic-events/:id
 */
app.get('/panic-events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await db.getAsync(
      `SELECT * FROM panic_events WHERE id = ?`,
      [id]
    );
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    const results = await db.allAsync(
      `SELECT * FROM panic_results WHERE panic_event_id = ?`,
      [id]
    );
    
    res.json({ event, results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// Start Server
// ============================================================================

app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║  🚨 SafeAlert Backend Server                          ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${NODE_ENV}`);
  console.log(`📱 WhatsApp From: ${TWILIO_WHATSAPP_FROM}`);
  console.log(`🔗 Frontend URL: ${FRONTEND_URL}`);
  console.log('');
  console.log('Available endpoints:');
  console.log(`  GET    http://localhost:${PORT}/`);
  console.log(`  POST   http://localhost:${PORT}/panic`);
  console.log(`  POST   http://localhost:${PORT}/send-alert`);
  console.log(`  GET    http://localhost:${PORT}/contacts`);
  console.log(`  POST   http://localhost:${PORT}/contacts`);
  console.log(`  GET    http://localhost:${PORT}/panic-events`);
  console.log('');
  console.log('💡 Make sure your Twilio credentials are set in .env');
  console.log('');
});
