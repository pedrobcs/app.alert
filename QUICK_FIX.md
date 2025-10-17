# 🚨 QUICK FIX: WhatsApp Not Sending Messages

## STEP 1: Join Twilio Sandbox (REQUIRED!)

**This is the #1 reason messages don't send!**

1. Open WhatsApp on your phone
2. Send a message to: **+1 415 523 8886**
3. Message text: **`join [your-code]`**
   - Get your code from: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
   - It looks like: `join happy-elephant-1234` or similar
4. Wait for confirmation message
5. ✅ Done! Now your number is authorized

## STEP 2: Verify Vercel Environment Variables

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

You need these **3 variables**:

```
TWILIO_ACCOUNT_SID          = AC... (from Twilio console)
TWILIO_AUTH_TOKEN           = your_token_here
TWILIO_WHATSAPP_NUMBER      = +14155238886
```

**Note**: The WhatsApp number for sandbox is always `+14155238886` (no "whatsapp:" prefix)

## STEP 3: Redeploy

After setting the variables:
1. Go to Vercel → Deployments
2. Click "Redeploy" on the latest deployment
3. Wait for deployment to finish

## STEP 4: Test

1. Open your app
2. Allow location permission
3. Click the emergency button
4. Check what error you get

## Common Errors and What They Mean:

| Error | Meaning | Fix |
|-------|---------|-----|
| "Messaging service not configured" | Environment variables not set | Add the 3 variables in Vercel |
| "Number not opted in to WhatsApp Sandbox" | You didn't join sandbox | Do STEP 1 above |
| "Authentication failed" | Wrong credentials | Check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN |
| No error but no message | Wrong phone number format | Must be +15085140864 (with +) |

## Where to Get Your Credentials:

1. **Twilio Console**: https://console.twilio.com
2. **Account SID & Auth Token**: On the main dashboard
3. **Sandbox Join Code**: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
4. **Message Logs**: https://console.twilio.com/us1/monitor/logs/messages

## Still Not Working?

Check the browser console (F12) and tell me:
1. What error message you see
2. What's in the Network tab when you click the button
3. Any errors in the Vercel function logs

---

**Most likely issue**: You need to join the Twilio Sandbox! Do STEP 1 first!
