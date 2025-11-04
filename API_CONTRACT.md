# SafeAlert API Contract

This document describes the API contract between the SafeAlert frontend and the internal Next.js API route that sends WhatsApp messages via Twilio.

## Environment Variables

The route requires the following server-side variables:

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM` (e.g., `whatsapp:+14155238886`)

## Endpoints

### POST /panic

Sends an emergency alert with location information.

#### Request

**Method**: `POST`

**URL**: `/api/panic`

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "contacts": ["+15085140864"],
  "message": "🚨 EMERGÊNCIA! Preciso de ajuda! Estou em: 123 Main St, City, Country",
  "location": {
    "lat": -23.550520,
    "lng": -46.633308
  }
}
```

**Body Schema**:
```typescript
{
  contacts: string[];    // Array of phone numbers in E.164 format
  message: string;       // Emergency message with address
  location: {
    lat: number;        // Latitude (-90 to 90)
    lng: number;        // Longitude (-180 to 180)
  }
}
```

#### Response

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Emergency alert sent successfully"
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "error": "Invalid phone number format"
}
```

**Error Response** (500 Internal Server Error):
```json
{
  "success": false,
  "error": "Failed to send WhatsApp message"
}
```

#### Response Schema

```typescript
{
  success: boolean;
  message?: string;    // Present on success
  error?: string;      // Present on error
}
```

## External APIs

### OpenStreetMap Nominatim (Reverse Geocoding)

Used internally by the frontend to convert coordinates to addresses.

**Endpoint**: `https://nominatim.openstreetmap.org/reverse`

**Parameters**:
- `format=json`
- `lat={latitude}`
- `lon={longitude}`
- `zoom=18`
- `addressdetails=1`

**Note**: This is called client-side and doesn't require backend implementation.

## Phone Number Format

All phone numbers must be in **E.164 format**:
- Starts with `+`
- Followed by country code
- Followed by phone number
- No spaces, dashes, or parentheses

**Examples**:
- ✅ `+15085140864` (USA)
- ✅ `+5511987654321` (Brazil)
- ✅ `+442071234567` (UK)
- ❌ `(508) 514-0864`
- ❌ `+1 508-514-0864`
- ❌ `15085140864`

## Message Format

The message is automatically formatted as:

```
🚨 EMERGÊNCIA! Preciso de ajuda! Estou em: {address}
```

Where `{address}` is replaced with:
- Full address from reverse geocoding (preferred)
- GPS coordinates if geocoding fails: `lat, lng`

**Example Messages**:
```
🚨 EMERGÊNCIA! Preciso de ajuda! Estou em: 123 Main Street, Springfield, MA 01103, United States

🚨 EMERGÊNCIA! Preciso de ajuda! Estou em: -23.550520, -46.633308
```

## Error Handling

The frontend handles these error scenarios:

### Network Errors
- Connection timeout
- No internet connection
- DNS resolution failure

**User Message**: "Network error. Please check your connection."

### Location Errors
- Permission denied
- Location unavailable
- Timeout getting location

**User Messages**:
- "Location permission denied. Please enable location access."
- "Location information unavailable."
- "Location request timed out. Please try again."

### API Errors
- Invalid API URL
- Backend error responses
- Invalid response format

**User Message**: Error message from backend or "Failed to send alert"

## CORS Configuration

The backend must enable CORS for the frontend domain.

### Development
```javascript
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### Production
```javascript
Access-Control-Allow-Origin: https://safealert.yourdomain.com
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## Rate Limiting

Consider implementing rate limiting on the backend:

**Recommended limits**:
- 10 requests per minute per IP
- 100 requests per hour per IP

**Rate limit response** (429 Too Many Requests):
```json
{
  "success": false,
  "error": "Too many requests. Please try again later."
}
```

## Twilio WhatsApp Integration

The backend should integrate with Twilio's WhatsApp API:

### Twilio Sandbox (Development)

1. Set up Twilio account
2. Configure WhatsApp Sandbox
3. Users must send "join {your-code}" to activate

### Twilio Production (Production)

1. Request WhatsApp Business Profile approval
2. Configure WhatsApp messaging service
3. Users can receive messages without joining

### Message Sending

```javascript
// Example using Twilio SDK
const client = require('twilio')(accountSid, authToken);

await client.messages.create({
  from: 'whatsapp:+14155238886',
  to: `whatsapp:${contact}`,
  body: message
});
```

## Security Considerations

### Input Validation

**Backend should validate**:
- Phone numbers are valid E.164 format
- Message length (max 1000 characters)
- Coordinates are valid ranges
- Array lengths (max 10 contacts)

### Authentication (Optional)

For production, consider adding authentication:

```json
{
  "headers": {
    "Authorization": "Bearer {token}"
  }
}
```

### Request Signing (Optional)

For additional security, implement request signing:

```json
{
  "headers": {
    "X-Signature": "sha256-hash-of-body"
  }
}
```

## Testing

### Test Request (cURL)

```bash
curl -X POST http://localhost:3000/api/panic \
  -H "Content-Type: application/json" \
  -d '{
    "contacts": ["+15085140864"],
    "message": "🚨 EMERGÊNCIA! Preciso de ajuda! Estou em: 123 Test Street",
    "location": {
      "lat": -23.550520,
      "lng": -46.633308
    }
  }'
```

### Expected Response

```json
{
  "success": true,
  "message": "Emergency alert sent successfully"
}
```

## Example Backend Implementation (Node.js/Express)

```javascript
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['POST']
}));
app.use(express.json());

app.post('/panic', async (req, res) => {
  try {
    const { contacts, message, location } = req.body;

    // Validate input
    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid contacts array'
      });
    }

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid message'
      });
    }

    if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Invalid location'
      });
    }

    // Send WhatsApp messages
    const promises = contacts.map(contact =>
      client.messages.create({
        from: 'whatsapp:+14155238886',
        to: `whatsapp:${contact}`,
        body: message
      })
    );

    await Promise.all(promises);

    res.json({
      success: true,
      message: 'Emergency alert sent successfully'
    });
  } catch (error) {
    console.error('Error sending alert:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send emergency alert'
    });
  }
});

app.listen(3001, () => {
  console.log('Backend listening on port 3001');
});
```

## Monitoring and Logging

### Recommended Logs

**Backend should log**:
- Request timestamp
- Contact numbers (hashed for privacy)
- Location coordinates
- Message delivery status
- Error details
- Response time

**Example log entry**:
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "endpoint": "/panic",
  "contacts_count": 1,
  "location": {"lat": -23.550520, "lng": -46.633308},
  "status": "success",
  "response_time_ms": 1234
}
```

## Support

For questions about the API contract:
- Review this document
- Check the frontend code in `src/lib/api.ts`
- Test with the provided cURL examples
- Open an issue on the repository

---

**API Version**: 1.0.0  
**Last Updated**: 2024-01-15
