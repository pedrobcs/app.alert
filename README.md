# Construction Calculator (Next.js + TypeScript)

A responsive, modular construction calculator web-app inspired by “construction master” style keypads.

This repo is the **foundation/MVP**: landing page + calculator UI, internal stateless API for calculations, i18n (pt/en), and a first batch of deterministic math functions with unit tests.

## Tech

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** for styling
- **Next API Route**: `POST /api/calc`
- **Vitest** for unit tests + coverage
- **ESLint** + **Prettier**

## Run locally

```bash
yarn install
yarn dev
```

Open `http://localhost:3000` and click **“Open Calculator”** / **“Abrir Calculadora”**.

## Test / lint / format

```bash
yarn test
yarn test:coverage
yarn lint
yarn format
yarn format:check
```

## API: `POST /api/calc`

Request shape:

```json
{
  "function": "pitchFromRiseRun",
  "params": { "rise": 6, "run": 12 },
  "inUnit": "ft",
  "outUnit": "ft",
  "precision": 16
}
```

Response shape:

```json
{
  "ok": true,
  "result": 6,
  "display": "6/12",
  "meta": { "precision": 16, "angleDeg": 26.56505117707799, "pitchIn": 6 }
}
```

Errors use HTTP 400 with `{ ok:false, errorCode, message }`. Unknown/stub functions return **HTTP 501**.

## Implemented functions (MVP)

- **Pitch / Rise / Run**
  - `pitchFromRiseRun(rise, run)` where \(pitch = \frac{rise}{run} \cdot 12\)
  - `riseFromPitchRun(pitch, run)` where \(rise = run \cdot \frac{pitch}{12}\)
  - `runFromPitchRise(pitch, rise)` where \(run = rise \cdot \frac{12}{pitch}\)
- **Diagonal**
  - `diagonal(rise, run)` where \(diag = \sqrt{rise^2 + run^2}\)
- **Conversions**
  - `convert(value, fromUnit, toUnit)` (length + mass in MVP)
- **Stairs (MVP defaults)**
  - `stairs(totalRise)` uses default riser \(7.75in\) and tread \(10in\), with:
    - \(numSteps = \lceil \frac{totalRise}{desiredRise} \rceil\)
    - \(actualRise = \frac{totalRise}{numSteps}\)

## Not implemented yet (stubs / planned)

Documented stubs live in `src/lib/math/stubs.ts` and are returned as **501** by the API:

- Hip/Valley, Compound Miter, Arc/Circle, Jack Rafter, DMS↔deg, Tape emulator, Cost, Saved Tapes persistence.

## Project structure (current)

```
src/
  app/
    page.tsx                  # Landing (CTA)
    calculator/page.tsx       # Calculator page
    api/calc/route.ts         # POST /api/calc
  components/                 # Display/Keypad UI
  lib/
    fraction.ts               # Rational/fractions utilities
    units.ts                  # SI normalization + formatting
    i18n/                      # pt/en dictionary + provider
    math/                      # Calculation functions
  tests/                       # Vitest unit tests
```
