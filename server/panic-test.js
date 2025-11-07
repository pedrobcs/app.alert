// panic-test.js - Test script for panic alert functionality
require('dotenv').config();
const twilio = require('twilio');

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_WHATSAPP_FROM = 'whatsapp:+14155238886'
} = process.env;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
  console.error('❌ ERROR: TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set in .env file');
  process.exit(1);
}

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// ⚠️ ADD YOUR TEST NUMBERS HERE (must be verified in Twilio sandbox)
const contacts = [
  'whatsapp:+15085140864', // Replace with your WhatsApp number
  // 'whatsapp:+15551234567', // Add more test numbers
];

// Customize your test message
const message = '🚨 ALERTA DE TESTE! O ICE ACABOU DE ME PEGAR. Este é um teste do sistema de alerta de emergência.\n\n📍 Localização: https://maps.google.com/?q=40.7128,-74.0060';

/**
 * Send test panic message to all contacts
 */
async function sendPanicMessage() {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║  🧪 Testing Panic Alert System                        ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`📤 Sending to ${contacts.length} contact(s)...`);
  console.log('');

  const results = {
    success: [],
    failed: []
  };

  for (const contact of contacts) {
    try {
      console.log(`📱 Sending to ${contact}...`);
      
      const msg = await client.messages.create({
        from: TWILIO_WHATSAPP_FROM,
        to: contact,
        body: message,
      });
      
      console.log(`✅ SUCCESS - Message sent to ${contact}`);
      console.log(`   SID: ${msg.sid}`);
      console.log(`   Status: ${msg.status}`);
      console.log('');
      
      results.success.push({ contact, sid: msg.sid });
    } catch (error) {
      console.error(`❌ FAILED - Error sending to ${contact}`);
      console.error(`   Error: ${error.message}`);
      console.error('');
      
      results.failed.push({ contact, error: error.message });
    }
  }

  // Summary
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║  📊 Test Summary                                      ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`Total contacts: ${contacts.length}`);
  console.log(`✅ Successful: ${results.success.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log('');

  if (results.failed.length > 0) {
    console.log('Failed contacts:');
    results.failed.forEach(({ contact, error }) => {
      console.log(`  • ${contact}: ${error}`);
    });
    console.log('');
    console.log('💡 Common issues:');
    console.log('  1. Number not verified in Twilio Sandbox');
    console.log('  2. User hasn\'t sent "join <sandbox-code>" to Twilio number');
    console.log('  3. Invalid phone number format (must be E.164)');
    console.log('');
  }

  process.exit(results.failed.length > 0 ? 1 : 0);
}

// Run the test
sendPanicMessage().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
