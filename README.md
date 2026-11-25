# ISO DISCS CIS MVC Framework with a Mathematical Library

A standalone JavaScript ES-module implementation of the ISO DISCS CIS workflow.

## Features

- **Model:** validated, immutable CIS configuration (defaults: `code=3`, `id=2`, `status=0.14`), plus DUPLICATE, INPUT, and SYSTEM_CHECK modes.
- **Controller:** sequential sorting, pass-through output, and deterministic seeded random-test sorting.
- **View:** serializable ISO duplicate view.
- **Math library:** sorting, duplicate detection, mean, population variance, standard deviation, normalization, and checksum.
- **Registry:** validated JSON persistence with atomic file replacement.
- **Dashboard and API:** browser console with MVC execution and registry management.
- **Health endpoint:** `GET /health` for hosting-platform health checks.
- **Tests:** Node.js built-in test runner; no third-party runtime dependencies.

## Requirements and local run

Node.js 20 or newer.

```sh
npm run iso-discs:test
npm start
```

Open http://localhost:4173/iso-discs. Set `PORT` to change the server port.

## API

- `GET /health` — service health status.
- `GET /api/iso-discs` — list saved records.
- `POST /api/iso-discs` — create or update a record. JSON body: `{"id":"disc-1","label":"Primary","cis":{"code":3,"id":2,"status":0.14}}`.
- `POST /api/iso-discs/run` — run MVC. JSON body: `{"values":[8,3,5,3],"sortMode":"SEQUENTIAL","discMode":"DUPLICATE","seed":42}`.
- `DELETE /api/iso-discs/:id` — remove a record.

## GitHub Actions

The `.github/workflows/iso-discs-cis.yml` workflow validates JavaScript syntax, runs the test suite, starts the server, and smoke-tests the health endpoint, dashboard, and MVC API on pushes, pull requests, and manual runs.

## Deploy to Render

A Render Blueprint is provided in `render.yaml`. In Render, create a new Blueprint deployment and select this repository. The configuration uses a Node.js web service and a 1 GB persistent disk mounted at `data`, so the JSON registry survives service restarts and redeployments.

**Cost note:** the Blueprint specifies Render's Starter service plan and a persistent disk. Review Render's current pricing before creating the service; no hosting service is created automatically by this repository change.

## Library usage

```js
import { createISODiscSystem, SortMode } from "./src/index.js";

const app = createISODiscSystem({ sortMode: SortMode.SEQUENTIAL });
console.log(app.run([8, 3, 5, 3], 42));
```

The seeded registry is stored in `data/discs.json`.
