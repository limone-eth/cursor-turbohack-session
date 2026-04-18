# Upstream libraries (git submodules)

These match the stack used by [limone-eth/human-design](https://github.com/limone-eth/human-design) for chart computation and visualization.

## Chart computation (ephemeris, time, timezone)

| Submodule | Upstream | Role in Human Design |
|-----------|----------|----------------------|
| `sweph-wasm` | [ptprashanttripathi/sweph-wasm](https://github.com/ptprashanttripathi/sweph-wasm) | Swiss Ephemeris compiled to WebAssembly — planetary longitudes (Sun, Moon, nodes, etc.) used to derive **gates** and **design date**. |
| `luxon` | [moment/luxon](https://github.com/moment/luxon) | Date/time math and formatting (local birth time → UTC, design-time windows). |
| `tz-lookup` | [darkskyapp/tz-lookup-oss](https://github.com/darkskyapp/tz-lookup-oss) | **OSS lineage** of the `tz-lookup` npm package — maps lat/lng → IANA timezone for correct local→UTC conversion. (The original `darkskyapp/tz-lookup` GitHub repo was removed; npm still ships the packaged tarball.) |

Application-side logic (64 gates, channels, centers, authority, profile, incarnation cross, variables) in that project is **custom TypeScript** under `lib/human-design/`, not a separate published library.

## Bodygraph rendering

| Submodule | Upstream | Role |
|-----------|----------|------|
| `hdkit` | [jdempcy/hdkit](https://github.com/jdempcy/hdkit) | Open-source Human Design kit — **bodygraph SVG** layout and gate geometry referenced when building the chart diagram (the production app inlines adapted SVG). |

## Group / AI “analysis” reports

There is **no standalone analysis library** in that codebase. Admin “analysis” calls the **OpenRouter** HTTP API (`https://openrouter.ai/api/v1/chat/completions`) with prompts built from structured chart data (`lib/ai/openrouter.ts`). Clone the [OpenRouter docs](https://openrouter.ai/docs) if you need a reference; integration is plain `fetch` + env API key.

## Submodule commands

```bash
git submodule update --init --recursive   # after clone
git submodule update --remote --merge     # pull latest upstream (optional)
```
