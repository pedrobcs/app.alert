/**
 * Database utilities for SafeAlert backend
 * Using better-sqlite3 for synchronous SQLite operations
 */

import Database from 'better-sqlite3';
import path from 'path';
import type { Contact, PanicEvent, PanicEventResult } from '@/types/api';

// Database file location (stored in project root)
const DB_PATH = path.join(process.cwd(), 'data.db');

// Singleton database instance
let db: Database.Database | null = null;

/**
 * Get or create database instance
 */
export function getDatabase(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL'); // Write-Ahead Logging for better performance
    initializeDatabase(db);
  }
  return db;
}

/**
 * Initialize database tables
 */
function initializeDatabase(database: Database.Database): void {
  // Contacts table
  database.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT UNIQUE NOT NULL,
      opt_in INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Panic events table
  database.exec(`
    CREATE TABLE IF NOT EXISTS panic_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      meta TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Panic results table
  database.exec(`
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

  console.log('✅ Database initialized');
}

/**
 * Close database connection
 */
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

// ============================================================================
// Contact Operations
// ============================================================================

/**
 * Create a new contact
 */
export function createContact(
  name: string | null,
  phone: string,
  opt_in: boolean
): Contact | null {
  const db = getDatabase();
  
  try {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO contacts (name, phone, opt_in) 
      VALUES (?, ?, ?)
    `);
    
    stmt.run(name, phone, opt_in ? 1 : 0);
    
    return getContactByPhone(phone);
  } catch (error) {
    console.error('Error creating contact:', error);
    return null;
  }
}

/**
 * Get contact by phone number
 */
export function getContactByPhone(phone: string): Contact | null {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM contacts WHERE phone = ?');
  return stmt.get(phone) as Contact | null;
}

/**
 * Get contact by ID
 */
export function getContactById(id: number): Contact | null {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM contacts WHERE id = ?');
  return stmt.get(id) as Contact | null;
}

/**
 * Get all contacts
 */
export function getAllContacts(): Contact[] {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC');
  return stmt.all() as Contact[];
}

/**
 * Update contact
 */
export function updateContact(
  id: number,
  updates: { name?: string; phone?: string; opt_in?: boolean }
): Contact | null {
  const db = getDatabase();
  const current = getContactById(id);
  
  if (!current) {
    return null;
  }
  
  const name = updates.name !== undefined ? updates.name : current.name;
  const phone = updates.phone !== undefined ? updates.phone : current.phone;
  const opt_in = updates.opt_in !== undefined ? (updates.opt_in ? 1 : 0) : current.opt_in;
  
  const stmt = db.prepare(`
    UPDATE contacts 
    SET name = ?, phone = ?, opt_in = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `);
  
  stmt.run(name, phone, opt_in, id);
  
  return getContactById(id);
}

/**
 * Delete contact
 */
export function deleteContact(id: number): boolean {
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM contacts WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

/**
 * Get contacts by IDs
 */
export function getContactsByIds(ids: number[]): Contact[] {
  if (ids.length === 0) return [];
  
  const db = getDatabase();
  const placeholders = ids.map(() => '?').join(',');
  const stmt = db.prepare(`SELECT * FROM contacts WHERE id IN (${placeholders})`);
  return stmt.all(...ids) as Contact[];
}

/**
 * Update contact opt-in status
 */
export function updateContactOptIn(phone: string, opt_in: boolean): void {
  const db = getDatabase();
  
  // Create contact if doesn't exist
  const stmt1 = db.prepare(`
    INSERT OR IGNORE INTO contacts (phone, opt_in) VALUES (?, ?)
  `);
  stmt1.run(phone, opt_in ? 1 : 0);
  
  // Update opt-in status
  const stmt2 = db.prepare(`
    UPDATE contacts SET opt_in = ?, updated_at = CURRENT_TIMESTAMP WHERE phone = ?
  `);
  stmt2.run(opt_in ? 1 : 0, phone);
}

// ============================================================================
// Panic Event Operations
// ============================================================================

/**
 * Create panic event
 */
export function createPanicEvent(
  message: string,
  latitude: number | null,
  longitude: number | null,
  meta: string | null
): number {
  const db = getDatabase();
  
  const stmt = db.prepare(`
    INSERT INTO panic_events (message, latitude, longitude, meta) 
    VALUES (?, ?, ?, ?)
  `);
  
  const result = stmt.run(message, latitude, longitude, meta);
  return result.lastInsertRowid as number;
}

/**
 * Create panic result
 */
export function createPanicResult(
  panicEventId: number,
  contactPhone: string,
  status: 'sent' | 'failed',
  sid?: string,
  error?: string
): void {
  const db = getDatabase();
  
  const stmt = db.prepare(`
    INSERT INTO panic_results (panic_event_id, contact_phone, status, sid, error) 
    VALUES (?, ?, ?, ?, ?)
  `);
  
  stmt.run(panicEventId, contactPhone, status, sid || null, error || null);
}

/**
 * Get all panic events
 */
export function getAllPanicEvents(limit = 50): PanicEvent[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM panic_events 
    ORDER BY created_at DESC 
    LIMIT ?
  `);
  return stmt.all(limit) as PanicEvent[];
}

/**
 * Get panic event by ID
 */
export function getPanicEventById(id: number): PanicEvent | null {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM panic_events WHERE id = ?');
  return stmt.get(id) as PanicEvent | null;
}

/**
 * Get panic event results
 */
export function getPanicEventResults(panicEventId: number): PanicEventResult[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM panic_results 
    WHERE panic_event_id = ?
  `);
  return stmt.all(panicEventId) as PanicEventResult[];
}
