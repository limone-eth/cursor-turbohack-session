# Vendored upstream libraries

Snapshots of the open-source projects used by [limone-eth/human-design](https://github.com/limone-eth/human-design) for chart computation and visualization. These are **plain folders** (no submodules, no recursive init), so a normal `git clone` is enough.

## Chart computation (ephemeris, time, timezone)

| Folder | Upstream | Role in Human Design |
|--------|----------|----------------------|
| `sweph-wasm/` | [ptprashanttripathi/sweph-wasm](https://github.com/ptprashanttripathi/sweph-wasm) | Swiss Ephemeris compiled to WebAssembly — planetary longitudes (Sun, Moon, nodes, etc.) used to derive **gates** and the **design date**. |
| `luxon/` | [moment/luxon](https://github.com/moment/luxon) | Date/time math and formatting (local birth time → UTC, design-time windows). |
| `tz-lookup/` | [darkskyapp/tz-lookup-oss](https://github.com/darkskyapp/tz-lookup-oss) | OSS lineage of the `tz-lookup` npm package — lat/lng → IANA timezone for correct local→UTC conversion. |

Application-side logic (64 gates, channels, centers, authority, profile, incarnation cross, variables) in the reference project is **custom TypeScript** under `lib/human-design/`, not a separate published library.

## Bodygraph rendering

| Folder | Upstream | Role |
|--------|----------|------|
| `hdkit/` | [jdempcy/hdkit](https://github.com/jdempcy/hdkit) | Open-source Human Design kit — **bodygraph SVG** and gate geometry. (The 236 MB `sample-apps/` folder is intentionally omitted.) |

## Group / AI “analysis” reports

There is **no standalone analysis library** in the reference codebase. Admin “analysis” calls the **OpenRouter** HTTP API (`https://openrouter.ai/api/v1/chat/completions`) with prompts built from structured chart data (`lib/ai/openrouter.ts`). Nothing to vendor — see [openrouter.ai/docs](https://openrouter.ai/docs).

## Refreshing a snapshot

These folders are read-only references. To update one, re-clone from upstream over the top:

```bash
rm -rf vendor/<name>
git clone --depth 1 <upstream-url> vendor/<name>
rm -rf vendor/<name>/.git
```
