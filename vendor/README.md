# Vendored libraries (HD chart essentials)

Trimmed, plain-folder snapshots of the open-source projects used by [limone-eth/human-design](https://github.com/limone-eth/human-design) for chart computation and rendering. Only the runtime library files needed to **compute** and **draw** a Human Design chart are kept — no tests, docs sites, demo apps, or build tooling.

Upstream equivalents are installable from npm; these copies exist as readable reference while we build.

## Chart computation

### Swiss Ephemeris (`sweph-wasm`)

Upstream: [ptprashanttripathi/sweph-wasm](https://github.com/ptprashanttripathi/sweph-wasm) · npm: [`sweph-wasm`](https://www.npmjs.com/package/sweph-wasm)

Installed as a normal app dependency (`package.json`), not copied under `vendor/`. A vendored folder must not reuse the package name `sweph-wasm` or bundlers resolve imports to incomplete `src/` instead of `node_modules/…/dist`.

Produces the planetary longitudes (Sun, Moon, nodes, …) that drive **gate activations** and the **design date**.

### `luxon/` — date/time math

Upstream: [moment/luxon](https://github.com/moment/luxon) · npm: `luxon`

Kept:
- `src/` — entire library source (`datetime.js`, `duration.js`, `zones/*`, `impl/*`, …)
- `package.json`, `README.md`, `LICENSE.md`

Handles local-birth-time → UTC conversion and design-time windows.

### `tz-lookup/` — lat/lng → IANA timezone

Upstream: [darkskyapp/tz-lookup-oss](https://github.com/darkskyapp/tz-lookup-oss) · npm: `tz-lookup`

Kept:
- `tz.js` — the compiled lookup function (single-file library)
- `package.json`, `README.md`, `LICENSE`

Feeds `luxon` the correct zone for the birth location.

## Chart rendering

### `hdkit/` — bodygraph geometry

Upstream: [jdempcy/hdkit](https://github.com/jdempcy/hdkit)

Kept:
- `hdkit.js` — entry
- `bodygraph-data.js` — center/channel/gate coordinates
- `constants.js` — gate, line, planet, and center constants
- `README.md`, `LICENSE`

Reference layout used when adapting the bodygraph SVG in the reference project (`components/bodygraph/`). The 236 MB `sample-apps/` folder from upstream is **intentionally excluded**.

## Analysis / reports

No third-party library — the reference codebase calls **OpenRouter** directly via `fetch` (`lib/ai/openrouter.ts`). See [openrouter.ai/docs](https://openrouter.ai/docs).

## Refreshing a snapshot

```bash
rm -rf vendor/<name>
git clone --depth 1 <upstream-url> vendor/<name>
rm -rf vendor/<name>/.git
# then re-trim to the files listed above
```
