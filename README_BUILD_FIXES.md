# Build Status – FuturesPilot

The legacy build issues referenced in this file (Prisma, wallet hooks, etc.) no longer apply. The project is now database-free and wallet-free, so a production build is as simple as:

```bash
yarn install
yarn build
yarn start
```

If you reintroduce a backend or wallet SDKs, remember to document the required scripts and dependencies here. Until then, enjoy the zero-config deploys.
