# Quick Start – FuturesPilot

## 1. Install
```bash
yarn install
```

## 2. Run
```bash
yarn dev
```
Visit http://localhost:3000 and explore `/dashboard`, `/strategies`, and `/intelligence`.

## 3. Customize
- Update the landing page copy in `src/app/page.tsx`.
- Modify telemetry data in `src/app/dashboard/page.tsx`.
- Edit or seed strategies in `src/lib/validation/strategy.ts`.

## 4. Build & Deploy
```bash
yarn build
yarn start
```
Deploy with `vercel --prod` or any static hosting provider. No wallet config or env vars needed.
