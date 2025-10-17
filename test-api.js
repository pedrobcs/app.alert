/**
 * Test script to debug the /api/panic endpoint locally
 * Run with: node test-api.js
 */

const testPayload = {
  contacts: ["+15085140864"],
  message: "🚨 EMERGÊNCIA! Preciso de ajuda! Estou em: Test Location, USA",
  location: {
    lat: 42.3601,
    lng: -71.0589
  }
};

console.log("Testing /api/panic endpoint...\n");
console.log("Payload:", JSON.stringify(testPayload, null, 2));
console.log("\n---\n");

// Test locally
fetch("http://localhost:3000/api/panic", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(testPayload),
})
  .then(response => {
    console.log("Status:", response.status);
    return response.json();
  })
  .then(data => {
    console.log("Response:", JSON.stringify(data, null, 2));
  })
  .catch(error => {
    console.error("Error:", error.message);
  });
