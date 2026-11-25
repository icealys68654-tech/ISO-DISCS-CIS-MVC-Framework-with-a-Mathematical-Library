Abstract Codebase Flatten*.*Files, Bind Vector Parse Phase for Workflow/Monorepo Placeholder Streamlining Umbrella CMAKE Github production ready .ZIP file for full-stack web app: C4 model (validation + diagram), smoke-probe (CI endpoint test), env-guard (.env linter)

ISO DISCS CIS(code = 3, ID = 2, status = .14)

SORT_CONTROLLER(*Sequential, *Output, *Random_Test).
DISC_MODEL(*Duplicate, *Input, *System_Check){
ISO_DUPLICATE_VIEW{*Sequential&output, *Duplicate&input}}

# ISO DISCS CIS MVC Framework with a Mathematical Library

A standalone JavaScript ES-module implementation of the ISO DISCS CIS workflow.

## Features

- **Model:** validated, immutable CIS configuration (defaults: `code=3`, `id=2`, `status=0.14`), plus DUPLICATE, INPUT, and SYSTEM_CHECK modes.
- **Controller:** sequential sorting, pass-through output, and deterministic seeded random-test sorting.
- **View:** serializable ISO duplicate view.
- **Math library:** sorting, duplicate detection, mean, population variance, standard deviation, normalization, and checksum.
- **Registry:** validated JSON persistence with atomic file replacement.
- **Dashboard and API:** browser console with MVC execution and registry management.
- **Tests:** Node.js built-in test runner; no third-party runtime dependencies.

## Requirements

Node.js 20 or newer.

## Run

```bash
npm run iso-discs:test
npm start
```

Open http://localhost:4173/iso-discs.

Set `PORT` to change the server port.

## API

- `GET /api/iso-discs` — list saved records.
- `POST /api/iso-discs` — create or update a record. JSON body: `{"id":"disc-1","label":"Primary","cis":{"code":3,"id":2,"status":0.14}}`.
- `POST /api/iso-discs/run` — run MVC. JSON body: `{"values":[8,3,5,3],"sortMode":"SEQUENTIAL","discMode":"DUPLICATE","seed":42}`.
- `DELETE /api/iso-discs/:id` — remove a record.

## Library usage

```js
import { createISODiscSystem, SortMode } from "./src/index.js";

const app = createISODiscSystem({ sortMode: SortMode.SEQUENTIAL });
console.log(app.run([8, 3, 5, 3], 42));
```

The seeded registry is stored in `data/discs.json`.
