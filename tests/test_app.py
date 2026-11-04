"""Smoke tests: open the app in a headless browser and check that it works.

Run them with `pytest`. They serve the web/ folder locally, so they test the same files
GitHub Pages publishes.
"""

import functools
import http.server
import threading
from pathlib import Path

import pytest
from playwright.sync_api import expect

WEB = Path(__file__).parent.parent / "web"


@pytest.fixture(scope="session")
def url():
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=WEB)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    yield f"http://127.0.0.1:{server.server_port}/"
    server.shutdown()


# Opens the app, waits for the first chart, and fails the test if the browser console shows
# any error.
@pytest.fixture
def app(page, url):
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.on("console", lambda msg: msg.type == "error" and errors.append(msg.text))
    page.goto(url)
    expect(page.locator("#chart svg")).to_be_visible(timeout=60_000)
    yield page
    assert errors == []


def test_chart_draws(app):
    expect(app.locator("#caption")).to_contain_text("United States")


def test_controls_redraw_chart(app):
    app.select_option("#country", "India")
    expect(app.locator("#caption")).to_contain_text("India")


def test_fits_a_phone_screen(app):
    app.set_viewport_size({"width": 390, "height": 844})
    overflow = app.evaluate("document.documentElement.scrollWidth > window.innerWidth")
    assert not overflow


def test_says_when_a_choice_has_no_data(app):
    # Monaco has no emissions data in the Our World in Data file.
    app.select_option("#country", "Monaco")
    expect(app.locator("#status")).to_contain_text("no data")
    expect(app.locator("#chart svg")).to_have_count(0)


def test_says_when_the_data_cannot_load(page, url):
    page.route("https://raw.githubusercontent.com/**", lambda route: route.abort())
    page.goto(url)
    expect(page.get_by_role("alert")).to_contain_text("could not be loaded", timeout=60_000)
