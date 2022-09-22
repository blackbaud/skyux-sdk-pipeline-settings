const playwright = require('playwright');

process.env.CHROME_BIN = playwright.chromium.executablePath();
process.env.FIREFOX_BIN = playwright.firefox.executablePath();
process.env.WEBKIT_HEADLESS_BIN = playwright.webkit.executablePath();

function applyBrowserLauncherKarmaConfig(config, browserSetName) {
  const browsers = new Map();

  browsers.set('chrome', {
    launcher: require('karma-chrome-launcher'),
    name: 'ChromeHeadless',
  });

  browsers.set('edge', {
    launcher: require('@chiragrupani/karma-chromium-edge-launcher'),
    name: 'EdgeHeadless',
  });

  browsers.set('firefox', {
    launcher: require('karma-firefox-launcher'),
    name: 'FirefoxHeadless',
  });

  browsers.set('safari', {
    launcher: require('karma-webkit-launcher'),
    name: 'WebkitHeadless',
  });

  const browserSets = {
    speedy: ['chrome'],
    quirky: ['chrome', 'edge'],
    paranoid: ['chrome', 'edge', 'firefox', 'safari'],
  };

  const browserSet = browserSets[browserSetName];
  if (browserSet) {
    config.plugins.push(...browserSet.map((k) => browsers.get(k).launcher));
    config.browsers = browserSet.map((k) => browsers.get(k).name);
  }
}

module.exports = applyBrowserLauncherKarmaConfig;
