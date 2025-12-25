# Construction Master Web (MVP)

Next.js (App Router) + TypeScript + Tailwind web-app que clona e expande a calculadora estilo **Construction Master** (UI inspirada na imagem enviada).

Entrega atual (MVP): **Landing + Calculadora + `/api/calc` + 6 funções completas** com testes unitários e formatação de frações de polegada.

## O que já existe

- **`/` Landing**: CTA “Abrir Calculadora”
- **`/calculator`**: display + keypad (botões grandes, estilo “capsule”), responsivo e com navegação por clique
- **i18n (pt/en)**: toggle simples (persistido em `localStorage`)
- **API interna**: `POST /api/calc` (stateless)
- **Frações racionais (polegadas)**: formatação em `1/16"` (denom. configurável 2/4/8/16/32)
- **Testes**: vitest + coverage (>= 80%)

## Rodar local

```bash
yarn install
yarn dev
```

## Testes / qualidade

```bash
yarn test
yarn test:coverage
yarn lint
yarn format:check
```

## Contrato da API

`POST /api/calc`

Request:

```json
{
  "function": "pitchFromRiseRun",
  "params": { "rise": 6, "run": 12 },
  "inUnit": "ft",
  "outUnit": "ft",
  "precision": 16
}
```

Response (sempre inclui `display`; `result` é o valor normalizado SI quando aplicável):

```json
{
  "ok": true,
  "result": 6,
  "unit": "pitch/12",
  "display": "6/12",
  "outUnit": "ft",
  "resultOut": null,
  "meta": { "precision": 16, "angleDeg": 26.56505117707799, "slope": 0.5 }
}
```

Erros retornam HTTP 400/501 com:

```json
{ "ok": false, "errorCode": "INVALID_REQUEST", "message": "..." }
```

## Funções implementadas (com fórmulas)

Arquivos em `src/lib/math/*`.

- **Pitch / Slope**
  - `pitchFromRiseRun({ rise, run })`
    - \( \text{pitch} = \frac{rise}{run} \times 12 \)
    - \( \text{angle} = \arctan(\frac{rise}{run}) \times \frac{180}{\pi} \)
  - `riseFromPitchRun({ pitch, run })`
    - \( rise = \frac{pitch}{12} \times run \)
  - `runFromPitchRise({ pitch, rise })`
    - \( run = \frac{12}{pitch} \times rise \)
- **Diag (Diagonal)**
  - `diagonal({ rise, run })`
    - \( diag = \sqrt{rise^2 + run^2} \)
- **Conv (Conversões)**
  - `convert({ value })`
    - comprimento (m/cm/mm/ft/in/yd), massa (kg/lbs), acres, short ton e metric ton
    - normaliza para SI base: `m`, `kg`, `m2`
- **Stair (Escadas)**
  - `stairs({ totalRise, desiredRise?, desiredTread? })`
    - \( steps = \lceil \frac{totalRise}{desiredRise} \rceil \)
    - \( actualRise = \frac{totalRise}{steps} \)
    - valida regra: \(2 \times riser + tread \approx 63"\ (\pm 3")\)

## Stubs (documentados e retornam 501)

Em `src/lib/math/stubs.ts`:

- `hipRafterLength`
- `compoundMiter`
- `arcRadiusFromChord`
- `circle`
- `jackRafter`
- `dmsToDeg` / `degToDms`
- `tape`
- `cost`

## Estrutura principal

```
src/
  app/
    api/calc/route.ts
    calculator/page.tsx
    page.tsx
    layout.tsx
    providers.tsx
  components/
    CalculatorApp.tsx
    CalculatorDisplay.tsx
    KeyButton.tsx
    Keypad.tsx
  lib/
    errors.ts
    fraction.ts
    units.ts
    i18n/
      dict.ts
      I18nProvider.tsx
    math/
      context.ts
      conversion.ts
      diagonal.ts
      pitch.ts
      stairs.ts
      stubs.ts
      types.ts
  tests/
    ...
```

## Notas / próximos passos

- Implementar input completo de **8' 3 3/8"** (parser) e keypad “/ × − +” com comportamento de calculadora.
- Implementar **Saved Tapes** e **Preferences** (persistência; pode ser local-first + API).
- Completar as funções restantes (hip/v, comp miter, arc/circ, dms<>deg, tape, cost) com referências e testes.
