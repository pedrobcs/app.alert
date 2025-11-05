# SafeAlert - Deployment Guide

Complete guide for deploying SafeAlert to production.

## Prerequisites

- Twilio WhatsApp Sandbox credentials (and joined recipient numbers)
- SSL certificate (required for PWA and Geolocation)
- Environment variables configured
- Generated PWA icons (192x192 and 512x512 PNG)

## Platform Options

### 1. Vercel (Recommended)

Vercel is the easiest way to deploy Next.js apps.

#### Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

#### Deploy with Git Integration

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Configure environment variables:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_WHATSAPP_FROM`
   - `TWILIO_WHATSAPP_TO`
   - `TWILIO_WHATSAPP_TEST_TO`
   - `NEXT_PUBLIC_CONTACT_1`
6. Click "Deploy"

#### Environment Variables in Vercel

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable:
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
   TWILIO_WHATSAPP_TO=whatsapp:+55XXXXXXXXXXX
   TWILIO_WHATSAPP_TEST_TO=whatsapp:+15085140864
   NEXT_PUBLIC_CONTACT_1=+15085140864
   ```
4. Save and redeploy

### 2. Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

#### netlify.toml Configuration

Create `netlify.toml` in your project root:

```toml
[build]
  command = "yarn build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### 3. AWS Amplify

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Connect your Git repository
4. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - yarn install
       build:
         commands:
           - yarn build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
5. Add environment variables
6. Deploy

### 4. Docker (Self-Hosted)

#### Dockerfile

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["yarn", "start"]
```

#### Build and Run

```bash
# Build image
docker build -t safealert .

# Run container
docker run -p 3000:3000 \
  -e TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx \
  -e TWILIO_AUTH_TOKEN=your_twilio_auth_token \
  -e TWILIO_WHATSAPP_FROM=whatsapp:+14155238886 \
  -e TWILIO_WHATSAPP_TO=whatsapp:+55XXXXXXXXXXX \
  -e TWILIO_WHATSAPP_TEST_TO=whatsapp:+15085140864 \
  -e NEXT_PUBLIC_CONTACT_1=+15085140864 \
  safealert
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  safealert:
    build: .
    ports:
      - "3000:3000"
    environment:
        - TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        - TWILIO_AUTH_TOKEN=your_twilio_auth_token
        - TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
        - TWILIO_WHATSAPP_TO=whatsapp:+55XXXXXXXXXXX
        - TWILIO_WHATSAPP_TEST_TO=whatsapp:+15085140864
        - NEXT_PUBLIC_CONTACT_1=+15085140864
    restart: unless-stopped
```

### 5. Cloudflare Pages

1. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
2. Connect your Git repository
3. Configure build settings:
   - Build command: `yarn build`
   - Build output: `.next`
   - Node version: 18
4. Add environment variables
5. Deploy

## SSL/HTTPS Setup

PWA and Geolocation API require HTTPS. Most platforms provide SSL automatically.

### For Self-Hosted Deployments

Use Let's Encrypt with Nginx:

```nginx
server {
    listen 80;
    server_name safealert.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name safealert.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/safealert.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/safealert.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Serverless API Deployment

The `/api/panic` and `/api/send-message` routes are deployed alongside the Next.js app. Ensure the required `TWILIO_*` environment variables are configured in every environment (Preview, Production) and re-deploy after changes. No separate backend service or CORS configuration is required when hosting on Vercel.

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] PWA icons generated (icon-192.png, icon-512.png)
- [ ] manifest.json configured correctly
- [ ] Service worker tested
- [ ] `/api/panic` tested on preview deployment
- [ ] Twilio sandbox recipients verified
- [ ] Location permissions tested on mobile
- [ ] PWA installation tested
- [ ] Emergency flow tested end-to-end
- [ ] Error handling verified
- [ ] Performance optimized (Lighthouse score)

## Post-Deployment

### 1. Test PWA Installation

- iOS Safari: Add to Home Screen
- Android Chrome: Install App
- Desktop: Install from browser

### 2. Test Location Features

- Test on multiple devices
- Verify GPS accuracy
- Check reverse geocoding
- Test permission handling

### 3. Monitor Performance

Use tools like:
- Google Lighthouse
- Vercel Analytics
- Sentry for error tracking
- Google Analytics or Plausible

### 4. Set Up Monitoring

```javascript
// Add to src/app/layout.tsx
if (process.env.NODE_ENV === 'production') {
  // Initialize error tracking (e.g., Sentry)
  // Initialize analytics
}
```

## Environment-Specific Configurations

### Development (.env.local)
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_WHATSAPP_TO=whatsapp:+55XXXXXXXXXXX
TWILIO_WHATSAPP_TEST_TO=whatsapp:+15085140864
NEXT_PUBLIC_CONTACT_1=+15085140864
```

### Staging (.env.staging)
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_WHATSAPP_TO=whatsapp:+55XXXXXXXXXXX
TWILIO_WHATSAPP_TEST_TO=whatsapp:+15085140864
NEXT_PUBLIC_CONTACT_1=+15085140864
```

### Production (.env.production)
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_WHATSAPP_TO=whatsapp:+55XXXXXXXXXXX
TWILIO_WHATSAPP_TEST_TO=whatsapp:+15085140864
NEXT_PUBLIC_CONTACT_1=+15085140864
```

## Performance Optimization

### 1. Image Optimization

PWA icons should be optimized:
```bash
# Using ImageMagick
convert icon.svg -resize 192x192 -quality 90 icon-192.png
convert icon.svg -resize 512x512 -quality 90 icon-512.png
```

### 2. Caching Strategy

Service worker caches static assets. Adjust cache duration in `public/sw.js`:

```javascript
const CACHE_NAME = 'safealert-v1'; // Update version on changes
```

### 3. Lighthouse Optimization

Run Lighthouse in DevTools:
- Target: 90+ Performance
- Target: 100 PWA
- Target: 90+ Accessibility
- Target: 100 Best Practices
- Target: 100 SEO

## Troubleshooting Production Issues

### PWA Not Installing
- Verify HTTPS is enabled
- Check manifest.json is accessible
- Ensure all icons exist and are valid
- Check browser console for errors

### Location Not Working
- Verify HTTPS is enabled
- Check browser permissions
- Test on multiple devices
- Check Geolocation API support

### API Errors
- Verify Twilio credentials for the deployment environment
- Confirm recipients are approved in the Twilio Sandbox
- Check Vercel function logs for `/api/panic`
- Check network tab in DevTools

## Rollback Strategy

If deployment fails:

1. **Vercel**: Use "Deployments" tab to rollback
2. **Docker**: Tag and deploy previous version
3. **Git**: Revert commit and redeploy

## Security Best Practices

- Use HTTPS everywhere
- Set Content Security Policy headers
- Validate environment variables
- Enable rate limiting on API
- Implement request authentication
- Monitor for security vulnerabilities
- Keep dependencies updated

## Domain Configuration

### Custom Domain Setup

1. Add domain in platform settings
2. Configure DNS records:
   ```
   Type: A
   Name: @
   Value: [Platform IP]
   
   Type: CNAME
   Name: www
   Value: [Platform domain]
   ```
3. Wait for DNS propagation
4. Enable SSL certificate

## Continuous Deployment

Set up automatic deployments on Git push:

1. Connect Git repository to platform
2. Configure branch deployment rules:
   - `main` → Production
   - `staging` → Staging environment
   - `feature/*` → Preview deployments

## Support and Maintenance

- Monitor error rates
- Check API response times
- Review user feedback
- Update dependencies regularly
- Test new browser versions
- Monitor PWA installation rates

---

**Your SafeAlert app is now production-ready!**

For issues or questions, refer to the README.md or open an issue.
