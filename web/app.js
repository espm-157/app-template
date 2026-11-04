// Libraries load from a CDN at fixed versions, so the app keeps working when a library changes.
import * as duckdb from "https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.32.0/+esm";
import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6.17/+esm";

const DATA_URL = "https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.csv";

const country = document.querySelector("#country");
const measure = document.querySelector("#measure");
const start = document.querySelector("#start");
const startLabel = document.querySelector("#start-label");
const chart = document.querySelector("#chart");
const caption = document.querySelector("#caption");

const units = {
  co2: "million tonnes per year",
  co2_per_capita: "tonnes per person per year",
  share_global_co2: "percent of the global total",
  cumulative_co2: "million tonnes since 1750",
};

let con;

async function query(sql) {
  const result = await con.query(sql);
  return result.toArray().map((row) => row.toJSON());
}

// Show a message in place of the chart: while loading, when a choice has no data, or when
// something fails. Never fill the gap with made-up numbers.
function message(text, { alert = false } = {}) {
  const p = document.createElement("p");
  p.id = "status";
  p.textContent = text;
  if (alert) p.setAttribute("role", "alert");
  chart.replaceChildren(p);
}

// Start DuckDB in a background worker, the same database we used from ibis in Python, and
// read the file once.
async function load() {
  const bundle = await duckdb.selectBundle(duckdb.getJsDelivrBundles());
  const workerUrl = URL.createObjectURL(
    new Blob([`importScripts("${bundle.mainWorker}");`], { type: "text/javascript" })
  );
  const db = new duckdb.AsyncDuckDB(new duckdb.VoidLogger(), new Worker(workerUrl));
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
  con = await db.connect();

  // Rows without an ISO code are regions such as "World" or "Europe".
  await con.query(`
    CREATE TABLE emissions AS
    SELECT country, year::INTEGER AS year, co2, co2_per_capita, share_global_co2, cumulative_co2
    FROM read_csv('${DATA_URL}')
    WHERE iso_code IS NOT NULL AND NOT starts_with(iso_code, 'OWID')
  `);

  const countries = await query("SELECT DISTINCT country FROM emissions ORDER BY country");
  country.replaceChildren(...countries.map((row) => new Option(row.country, row.country)));
  country.value = "United States";
}

// Each time a control changes, query the data again and redraw the chart.
async function update() {
  startLabel.value = start.value;
  const name = country.value.replaceAll("'", "''");
  const rows = await query(`
    SELECT year, ${measure.value} AS value
    FROM emissions
    WHERE country = '${name}' AND year >= ${start.value} AND value IS NOT NULL
    ORDER BY year
  `);

  const label = measure.selectedOptions[0].text.toLowerCase();
  if (rows.length === 0) {
    message(`There are no data on ${label} for ${country.value} from ${start.value} onward.`);
    caption.textContent = "Try another country, measure or first year.";
    return;
  }

  chart.replaceChildren(
    Plot.plot({
      width: chart.clientWidth,
      height: 360,
      marginLeft: 60,
      x: { label: "Year", tickFormat: "d" },
      y: { label: units[measure.value], grid: true },
      marks: [Plot.lineY(rows, { x: "year", y: "value", tip: true })],
    })
  );
  caption.textContent = `The line shows ${label} for ${country.value} from ${start.value} onward.`;
}

try {
  await load();
} catch (error) {
  message(
    `The data could not be loaded (${error.message}). Check your connection and reload the page.`,
    { alert: true }
  );
  throw error;
}

document.querySelector("#controls").addEventListener("input", update);

// Redraw at the new width once the reader stops resizing the window.
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(update, 200);
});

await update();
