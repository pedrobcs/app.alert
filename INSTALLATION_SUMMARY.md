# 🎊 Installation Summary – FuturesPilot

1. **Clone & Install**
   ```bash
   git clone <repo>
   cd app.alert
   yarn install
   ```
2. **Run in Development** – `yarn dev`
3. **Build for Production** – `yarn build && yarn start`
4. **Deploy to Vercel** – No env vars or databases required.

## Included Modules

- Landing page with CTA + capability grid
- Dashboard (funding radar, market pulse, action queue)
- Strategy Studio (local storage CRUD)
- Intelligence board (funding vs. basis charts)

## Customization Tips

- Update `seedStrategies` in `src/lib/validation/strategy.ts`
- Tweak Tailwind tokens inside `src/app/globals.css`
- Extend components in `src/components` for new desk telemetry

That’s it—no wallets, no Prisma, no secrets. Plug in your own analytics when you’re ready.
