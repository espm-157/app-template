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
