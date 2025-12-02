# ✅ Build Status

FuturesPilot no longer relies on Prisma or wallet SDKs, so the build is extremely lightweight. A production build is simply:

```bash
yarn install
yarn build
yarn start
```

- **No database** – all data lives in `localStorage`.
- **No wallet providers** – nothing to configure on Vercel.
- **No custom commands** – `next build` is all you need.

If you later add a backend, reintroduce the necessary scripts and document them here. For now, enjoy the zero-config deploys! 🚀
