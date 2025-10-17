# Debugging WhatsApp Message Not Sending

## Issue
When you click the emergency button, the message is not being sent to WhatsApp.

## Important: Twilio Sandbox Requirements ⚠️

**CRITICAL STEP**: Before testing, you MUST join the Twilio Sandbox:

1. **Send a WhatsApp message** from your phone (+15085140864) to Twilio's Sandbox number
2. The Twilio Sandbox number is: **+14155238886** (or check your Twilio console)
3. Send this message: **`join [your-sandbox-code]`** 
   - Example: `join happy-elephant-1234`
4. You should get a confirmation message
5. **Without this step, Twilio will reject all messages to your number!**

## Vercel Environment Variables Checklist

Go to Vercel → Your Project → Settings → Environment Variables and verify:

### Required Variables:
```
✓ TWILIO_ACCOUNT_SID = AC... (starts with AC)
✓ TWILIO_AUTH_TOKEN = your_auth_token
✓ TWILIO_WHATSAPP_NUMBER = +14155238886 (no "whatsapp:" prefix)
```

### Optional Variables:
```
NEXT_PUBLIC_API_BASE_URL = (leave empty to use local API routes)
NEXT_PUBLIC_CONTACT_1 = +15085140864
```

## Testing Steps

### 1. Check Browser Console
Open your browser DevTools (F12) and look for errors when clicking the button.

### 2. Check Network Tab
1. Open DevTools → Network tab
2. Click the emergency button
3. Look for the request to `/api/panic`
4. Check the response - what error message do you see?

### 3. Check Vercel Logs
1. Go to Vercel Dashboard
2. Click on your deployment
3. Click "Functions" tab
4. Look at the logs for `/api/panic`
5. Check for error messages

## Common Issues & Solutions

### Issue 1: "21610: Attempt to send to unverified number"
**Solution**: Join the Twilio Sandbox (see steps above)

### Issue 2: "20003: Authentication Error"
**Solution**: Double-check your TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in Vercel

### Issue 3: "Messaging service not configured"
**Solution**: Make sure `TWILIO_WHATSAPP_NUMBER` is set in Vercel (value: +14155238886)

### Issue 4: No error, but message doesn't arrive
**Solution**: 
- Check if you joined the Twilio Sandbox
- Verify your phone number format is correct: +15085140864 (with + and country code)
- Check Twilio Console → Monitor → Logs to see if message was sent

## Test Locally (Optional)

1. Create a `.env.local` file with your Twilio credentials:
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886
NEXT_PUBLIC_CONTACT_1=+15085140864
```

2. Run the dev server:
```bash
yarn dev
```

3. Test by clicking the emergency button

4. Check the terminal for console logs

## Getting Your Twilio Sandbox Code

1. Go to: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
2. Look for "Sandbox Configuration"
3. You'll see the join code (e.g., "join happy-elephant-1234")
4. Send this from your WhatsApp to +14155238886

## Verify Message Delivery in Twilio

1. Go to: https://console.twilio.com/us1/monitor/logs/messages
2. Look for recent messages
3. Check the status:
   - ✓ "delivered" = Success!
   - ✗ "failed" = Check error details
   - "undelivered" = Number not in sandbox

## Phone Number Format

Your number MUST be in E.164 format:
- ✅ Correct: `+15085140864`
- ❌ Wrong: `5085140864`
- ❌ Wrong: `(508) 514-0864`
- ❌ Wrong: `+1 508-514-0864`

## Next Steps

1. ✅ Join Twilio Sandbox (MOST IMPORTANT!)
2. ✅ Verify environment variables in Vercel
3. ✅ Redeploy your app
4. ✅ Test and check browser console + network tab
5. ✅ Check Vercel function logs
6. ✅ Check Twilio message logs

If you're still having issues, please provide:
- Error message from browser console
- Response from `/api/panic` in Network tab
- Error from Vercel function logs
- Screenshot from Twilio message logs
