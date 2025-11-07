# SafeAlert Backend Server

Twilio-powered emergency alert backend server for the SafeAlert PWA application.

## Features

- 🚨 **Panic Alert System**: Send emergency WhatsApp messages to multiple contacts
- 📱 **SMS Support**: Send SMS alerts (optional)
- 👥 **Contact Management**: Store and manage emergency contacts
- 📍 **Location Services**: Reverse geocoding with OpenStreetMap
- 💾 **SQLite Database**: Track alerts and delivery status
- 🔗 **Webhook Support**: Handle incoming Twilio messages
- 📊 **Event History**: View past panic events and results

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

Copy the example environment file and add your Twilio credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your Twilio credentials:

```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

**Getting Twilio Credentials:**

1. Sign up at [twilio.com](https://www.twilio.com/try-twilio)
2. Go to Console Dashboard
3. Copy your **Account SID** and **Auth Token**
4. For WhatsApp: Go to Messaging > Try it out > Send a WhatsApp message
5. Follow the instructions to set up the WhatsApp Sandbox

### 3. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3001`

### 4. Test the Connection

Test if Twilio is working:

```bash
# Edit panic-test.js and add your phone number
# Then run:
npm test
```

## API Endpoints

### Panic Alert

**POST /panic**

Send emergency alert to contacts.

```bash
curl -X POST http://localhost:3001/panic \
  -H "Content-Type: application/json" \
  -d '{
    "contacts": ["+15085140864"],
    "message": "Preciso de ajuda urgente!",
    "location": {
      "lat": 40.7128,
      "lng": -74.0060
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "panicEventId": 1,
  "message": "🚨 ALERTA! O ICE ACABOU DE ME PEGAR. Preciso de ajuda urgente!\n\n📍 Localização: https://maps.google.com/?q=40.7128,-74.0060",
  "results": [
    {
      "phone": "+15085140864",
      "status": "sent",
      "sid": "SM..."
    }
  ],
  "summary": {
    "total": 1,
    "sent": 1,
    "failed": 0
  }
}
```

### Contact Management

**Create Contact**
```bash
POST /contacts
{
  "name": "João Silva",
  "phone": "+15085140864",
  "opt_in": 1
}
```

**Get All Contacts**
```bash
GET /contacts
```

**Update Contact**
```bash
PUT /contacts/:id
{
  "name": "João Silva Updated",
  "opt_in": 1
}
```

**Delete Contact**
```bash
DELETE /contacts/:id
```

### Event History

**Get Recent Events**
```bash
GET /panic-events
```

**Get Event Details**
```bash
GET /panic-events/:id
```

### Health Check

**GET /**

```bash
curl http://localhost:3001/
```

## Database Schema

The server uses SQLite with three main tables:

### contacts
| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key |
| name | TEXT | Contact name |
| phone | TEXT | Phone number (E.164) |
| opt_in | INTEGER | Opt-in status (0 or 1) |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Update timestamp |

### panic_events
| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key |
| message | TEXT | Alert message |
| latitude | REAL | GPS latitude |
| longitude | REAL | GPS longitude |
| meta | TEXT | JSON metadata |
| created_at | DATETIME | Event timestamp |

### panic_results
| Field | Type | Description |
|-------|------|-------------|
| id | INTEGER | Primary key |
| panic_event_id | INTEGER | Foreign key to panic_events |
| contact_phone | TEXT | Recipient phone |
| status | TEXT | 'sent' or 'failed' |
| sid | TEXT | Twilio message SID |
| error | TEXT | Error message if failed |
| created_at | DATETIME | Send timestamp |

## WhatsApp Sandbox Setup

For testing with WhatsApp, you need to configure the Twilio Sandbox:

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Messaging** > **Try it out** > **Send a WhatsApp message**
3. You'll see a sandbox number (e.g., `+1 415 523 8886`)
4. Send `join <your-code>` from your WhatsApp to that number
5. You'll receive a confirmation message

**Example:**
```
Send to: +1 415 523 8886
Message: join orange-dog
```

Now you can receive WhatsApp messages from the server!

## Webhook Configuration

To receive incoming messages (opt-in/opt-out), configure the webhook in Twilio:

1. Make your server publicly accessible (use ngrok for testing):
   ```bash
   ngrok http 3001
   ```

2. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)

3. In Twilio Console, go to your WhatsApp Sandbox settings

4. Set **"WHEN A MESSAGE COMES IN"** to:
   ```
   https://abc123.ngrok.io/webhook/incoming
   ```

5. Save the configuration

Now users can:
- Send "join" to opt-in to alerts
- Send "stop" to opt-out

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| PORT | No | 3001 | Server port |
| NODE_ENV | No | development | Environment mode |
| TWILIO_ACCOUNT_SID | **Yes** | - | Twilio Account SID |
| TWILIO_AUTH_TOKEN | **Yes** | - | Twilio Auth Token |
| TWILIO_WHATSAPP_FROM | No | whatsapp:+14155238886 | WhatsApp sender number |
| TWILIO_FROM | No | - | SMS sender number (optional) |
| FRONTEND_URL | No | http://localhost:3000 | Frontend URL for CORS |

## Troubleshooting

### "Invalid credentials" error
- Check that `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` are correct
- Make sure there are no extra spaces in the `.env` file

### "Message not sent" error
- Verify the recipient joined the WhatsApp sandbox
- Check phone number format (must be E.164: `+15085140864`)
- Check Twilio account balance

### "CORS error" in frontend
- Make sure `FRONTEND_URL` in `.env` matches your frontend URL
- Restart the server after changing `.env`

### Database locked error
- Close any other processes using `data.db`
- Delete `data.db` and restart to recreate

## Development

### File Structure
```
server/
├── server.js          # Main server file
├── panic-test.js      # Test script
├── package.json       # Dependencies
├── .env               # Environment variables (create from .env.example)
├── .env.example       # Example environment file
├── data.db            # SQLite database (auto-created)
└── README.md          # This file
```

### Adding New Features

1. **Add a new endpoint:**
   ```javascript
   app.post('/my-endpoint', async (req, res) => {
     // Your code here
   });
   ```

2. **Add database table:**
   ```javascript
   await db.runAsync(`
     CREATE TABLE IF NOT EXISTS my_table (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       data TEXT
     )
   `);
   ```

## Deployment

### Deploy to Heroku

1. Create a Heroku app:
   ```bash
   heroku create safealert-backend
   ```

2. Set environment variables:
   ```bash
   heroku config:set TWILIO_ACCOUNT_SID=your_sid
   heroku config:set TWILIO_AUTH_TOKEN=your_token
   heroku config:set TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
   ```

3. Deploy:
   ```bash
   git push heroku main
   ```

### Deploy to Railway

1. Connect your GitHub repo to Railway
2. Add environment variables in Railway dashboard
3. Deploy automatically on push

### Deploy with Docker

```bash
docker build -t safealert-backend .
docker run -p 3001:3001 --env-file .env safealert-backend
```

## Security Notes

- Never commit `.env` file to git
- Use environment variables for all sensitive data
- Enable HTTPS in production
- Consider rate limiting for production
- Validate all user inputs
- Keep dependencies updated

## Support

- **Documentation**: See `API_CONTRACT.md` in the main project
- **Twilio Docs**: [twilio.com/docs](https://www.twilio.com/docs)
- **Issues**: Open an issue on GitHub

## License

MIT License - see LICENSE file for details
