# Deployment Guide – FuturesPilot

## TL;DR

1. Ensure Node 18+ and Yarn 1.22+ are installed.
2. Run `yarn install && yarn build` locally.
3. Deploy to Vercel (or any Node host) with the default build command.

No environment variables or databases are required for the starter experience.

## Recommended Steps

1. **Clone & Install**
   ```bash
   git clone <repo>
   cd app.alert
   yarn install
   ```
2. **Smoke Test**
   ```bash
   yarn dev
   open http://localhost:3000
   ```
3. **Production Build**
   ```bash
   yarn build && yarn start
   ```
4. **Vercel Deploy**
   - Build command: `yarn build`
   - Install command: `yarn install`
   - Output: `.next`

## Optional Enhancements

If you introduce a backend later:

- Add environment variables via Vercel project settings.
- Update `package.json` scripts accordingly.
- Document any new requirements in this guide.

Until then, deployments are zero-config. 🎉
