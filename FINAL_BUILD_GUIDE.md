# Final Build Guide – FuturesPilot

## Build Commands

```bash
yarn install
yarn build
yarn start
```

No extra scripts, no Prisma generation, no wallet setup.

## Local Checklist

- [x] `yarn dev` loads landing page
- [x] `/dashboard` shows funding radar + sample playbooks
- [x] `/strategies` saves ideas to local storage
- [x] `/intelligence` renders charts

## Deploying to Vercel

- Install command: `yarn install`
- Build command: `yarn build`
- Output directory: `.next`

Since the app is entirely client-driven, there are no env vars to configure. Add them later only if you wire up custom APIs.

## Troubleshooting

- **Stale data?** Clear browser local storage or open a private window.
- **Need authentication or persistence?** Add server routes and replace the storage helpers in `src/lib/validation/strategy.ts`.

Happy shipping! 🚀
