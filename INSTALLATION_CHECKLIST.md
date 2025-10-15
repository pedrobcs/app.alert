# SafeAlert - Installation Checklist

Use this checklist to ensure proper setup of SafeAlert.

## Pre-Installation

- [ ] Node.js 18+ installed
- [ ] Yarn or npm available
- [ ] Git repository cloned/initialized
- [ ] Code editor ready (VS Code recommended)

## Initial Setup

- [ ] Run `yarn install` to install dependencies
- [ ] Copy `.env.local.example` to `.env.local`
- [ ] Update `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
- [ ] Update `NEXT_PUBLIC_CONTACT_1` in `.env.local`
- [ ] Verify all files present (see PROJECT_SUMMARY.md)

## Development Environment

- [ ] Run `yarn dev` successfully starts server
- [ ] Access http://localhost:3000 in browser
- [ ] No console errors in browser DevTools
- [ ] Page loads and displays emergency button
- [ ] Location permission prompt appears

## Location Testing

- [ ] Browser location permission granted
- [ ] GPS coordinates displayed in status card
- [ ] Accuracy meter shown (±X meters)
- [ ] Manual refresh button works
- [ ] Error messages appear if permission denied

## PWA Testing (Desktop)

- [ ] Manifest accessible at http://localhost:3000/manifest.json
- [ ] Service worker registers (check DevTools → Application)
- [ ] Install prompt appears (if supported)
- [ ] Icons load correctly in manifest

## Backend Integration

- [ ] Backend API running and accessible
- [ ] ngrok tunnel created (if needed)
- [ ] API URL updated in .env.local
- [ ] CORS enabled on backend for localhost:3000
- [ ] Test API endpoint with curl/Postman

## Emergency Flow Testing

- [ ] Click emergency button
- [ ] Loading state appears
- [ ] API request sent (check Network tab)
- [ ] Success/error notification appears
- [ ] Backend receives correct payload
- [ ] WhatsApp message sent (if Twilio configured)

## Production Build

- [ ] Run `yarn build` completes successfully
- [ ] Run `yarn lint` passes with no errors
- [ ] No TypeScript errors
- [ ] Run `yarn start` for production server
- [ ] Test on production build

## Mobile Testing (Development)

- [ ] ngrok tunnel created for mobile access
- [ ] Mobile device on same network
- [ ] Access ngrok URL on mobile
- [ ] Location permission granted on mobile
- [ ] GPS accuracy acceptable
- [ ] Emergency button tap works
- [ ] Responsive design looks good

## PWA Testing (Mobile)

### iOS
- [ ] Open in Safari
- [ ] Share → Add to Home Screen
- [ ] Icon appears on home screen
- [ ] App opens in standalone mode
- [ ] Status bar color correct
- [ ] Location works in installed app

### Android
- [ ] Open in Chrome
- [ ] Install prompt appears
- [ ] Tap "Install" or "Add to Home Screen"
- [ ] Icon appears on home screen
- [ ] App opens in standalone mode
- [ ] Theme color correct
- [ ] Location works in installed app

## Icon Generation (Production)

- [ ] Visit https://realfavicongenerator.net/
- [ ] Upload public/icon.svg
- [ ] Download generated icons
- [ ] Replace icon-192.png and icon-512.png
- [ ] Verify icons in manifest.json
- [ ] Test PWA installation with new icons

## Documentation Review

- [ ] Read README.md
- [ ] Read QUICKSTART.md
- [ ] Read API_CONTRACT.md
- [ ] Read DEPLOYMENT.md (before deploying)
- [ ] Read FEATURES.md
- [ ] Review code comments

## Security Checklist

- [ ] .env.local not committed to Git
- [ ] .gitignore includes .env.local
- [ ] API URL uses HTTPS (production)
- [ ] No sensitive data in code
- [ ] Environment variables properly set

## Pre-Deployment Checklist

- [ ] All tests above passing
- [ ] Production icons generated
- [ ] Environment variables documented
- [ ] Backend deployed and accessible
- [ ] CORS configured for production domain
- [ ] SSL certificate ready
- [ ] Domain configured (if applicable)
- [ ] Error tracking setup (optional)
- [ ] Analytics configured (optional)

## Deployment Verification

- [ ] Production URL accessible
- [ ] HTTPS enforced
- [ ] Manifest accessible
- [ ] Service worker registers
- [ ] Location permission works
- [ ] Emergency button works
- [ ] API integration works
- [ ] PWA installable
- [ ] Icons display correctly
- [ ] Tested on multiple devices

## Post-Deployment

- [ ] Monitor error logs
- [ ] Test emergency flow end-to-end
- [ ] Verify WhatsApp messages received
- [ ] Check API response times
- [ ] Monitor PWA installation rate
- [ ] Gather user feedback

## Troubleshooting

If any checklist item fails, refer to:

1. **README.md** - Troubleshooting section
2. **QUICKSTART.md** - Common issues
3. **Browser DevTools Console** - Error messages
4. **Network Tab** - API request details
5. **Application Tab** - Service worker status

## Support Resources

- Project documentation in markdown files
- Code comments in source files
- Browser DevTools for debugging
- GitHub issues (if repository available)

## Notes

Use this space for installation-specific notes:

```
Date: _______________
Environment: [ ] Development [ ] Staging [ ] Production
Issues encountered: _________________________________
Resolution: _________________________________________
```

---

**Once all checkboxes are complete, SafeAlert is ready for use!**

For ongoing maintenance, review this checklist periodically and when:
- Updating dependencies
- Adding new features
- Changing API endpoints
- Deploying to new environments
