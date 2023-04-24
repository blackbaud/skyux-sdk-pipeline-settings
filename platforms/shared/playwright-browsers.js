// Setup playwright.
const playwright = require('playwright');

function playwrightBrowsers() {
  if (!process.env.CHROME_BIN && playwright.chromium?.executablePath) {
    process.env.CHROME_BIN = playwright.chromium.executablePath();
  }
  if (!process.env.FIREFOX_BIN && playwright.firefox?.executablePath) {
    process.env.FIREFOX_BIN = playwright.firefox.executablePath();
  }
  if (!process.env.EDGE_BIN && playwright.edge?.executablePath) {
    process.env.EDGE_BIN = playwright.edge.executablePath();
  }
  if (!process.env.WEBKIT_HEADLESS_BIN && playwright.webkit?.executablePath) {
    process.env.WEBKIT_HEADLESS_BIN = playwright.webkit.executablePath();
  }
}

module.exports = playwrightBrowsers;
