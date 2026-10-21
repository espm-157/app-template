# 🤖 Applications Module

[![App check](../../actions/workflows/check.yml/badge.svg)](../../actions/workflows/check.yml)

## Team Members

🦸
🦹

<!-- Replace with a link to your published app. -->
🌐 App: <https://espm-157.github.io/app-template/>

## 🎓 Learning Objectives

🎛️ Reactive design: controls, state, and what happens when a reader changes something  
🖥️ Where code runs: in the reader's browser or on a server, and what each one costs  
📦 Dependencies, and why every version is pinned  
✅ Continuous integration that tests an app in a real browser  
🚀 Shipping: continuous deployment to GitHub Pages  
⚖️ Open source licenses for code and for data  
📱 Layout that works on a phone, and accessibility  

## 📖 Content Overview

[💯 Assignment rubric](rubric.md)  
[📝 Design document](design.md)  

In modules 1 to 3 you answered questions in notebooks. A notebook works for the person who
runs it. An app lets anyone with a link ask their own version of the question: pick a
country, a city, a species or a threshold, and see the answer change.

In this module you take an analysis from one of the earlier modules and turn it into an
interactive app that a reader outside the class could use. You are in charge of the parts
that the earlier modules set up for you: dependencies, tests, deployment and the license.

The starter app in [`web/`](web/) is deliberately small. It reads the Our World in Data
CO₂ file from the climate module with DuckDB, offers two dropdowns and a slider, and draws
a line chart with Observable Plot. Replace it with your own.

### Streamlit and client-side apps

In past years this module used [Streamlit](https://streamlit.io/), and the
[previous template](https://github.com/espm-157/app-python-template) is still a good
illustration of the idea: each widget call such as `st.selectbox` draws a control and
returns its value, and Streamlit re-runs the whole script whenever a reader touches one.
That model needs a Python server that is always running, which has to be hosted, kept
awake and paid for.

This year we build the same kind of app to run entirely in the reader's browser. GitHub
Pages serves the files and the browser does the computing, so there is no server to run,
and the app keeps working for as long as the files are online. The tools are the ones we
already know:

| In the notebooks | In the browser |
|---|---|
| `ibis` on DuckDB | [DuckDB-WASM](https://duckdb.org/docs/api/wasm/overview), the same SQL on the same files |
| `plotnine` | [Observable Plot](https://observablehq.com/plot/), the same grammar of graphics |
| `leafmap.maplibregl` | [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/), the library underneath leafmap |
| `st.selectbox`, `st.slider` | HTML `<select>` and `<input>`, or [Observable Inputs](https://observablehq.com/framework/inputs/) |

The starter app is written in JavaScript, and your coding agent can write JavaScript as
well as Python. Your job is to decide what the app should do, check that it does it, and
explain your choices. The browser's developer tools (the console and the network tab) are
where you see errors and what data the app loads.

### Examples

- [Mosaic](https://idl.uw.edu/mosaic/) examples: linked, filterable views over DuckDB-WASM.
- [Observable Framework examples](https://github.com/observablehq/framework/tree/main/examples):
  static data apps with menus, charts and maps.
- [MapLibre examples](https://maplibre.org/maplibre-gl-js/docs/examples/) and
  [PMTiles](https://docs.protomaps.com/pmtiles/), maps served as single static files.
- [Mapping Inequality](https://dsl.richmond.edu/panorama/redlining/), a polished app built
  on the data from the spatial module.

### Paths

Most teams will build path 1. The others cover the same objectives in a different form.

1. **Web app.** A responsive app published from `web/` to GitHub Pages.
2. **Installable app.** The web app plus a manifest and a service worker, so that it can be
   installed to a phone's home screen and works offline (a progressive web app).
3. **Desktop app.** The web app packaged for local install with [Tauri](https://tauri.app/)
   or [Electron](https://www.electronjs.org/).
4. **Command-line tool.** A Python package that others can install with `pip`, published
   with a version number and a changelog.

## What to hand in

- Your app, with tests in `tests/` that pass on GitHub Actions.
- [`design.md`](design.md), filled in.
- A `LICENSE` file. This template has none on purpose; choosing one is part of the
  assignment.
- `prompts/`: your conversations with your coding agent, exported as files.
- An updated README with a link to your app and a short statement on AI use.

## Setup

To preview the app from the JupyterHub, run `make serve` in a terminal and open the link it
prints. Stop it with Ctrl-C.

To run the tests, install the packages in `requirements.txt` and a headless browser once:

```
pip install -r requirements.txt
playwright install --only-shell chromium
make test
```

GitHub Actions runs two workflows on every push. The app check runs the tests in a headless
browser. The site workflow publishes the `web/` folder to GitHub Pages.

Anything in a client-side app is public, including any key or token in its code. Never put
one in `web/`.

## Links

[🌐 Course Website](https://espm-157.carlboettiger.info/)
