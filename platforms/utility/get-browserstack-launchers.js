const getBrowserSet = require('./get-browser-set');

/**
 * Gets custom browser launchers for BrowserStack.
 * @param {string} browserSetKey Can be one of 'paranoid', 'quirky', or 'speedy'.
 * @returns An object representing Karma browser launchers.
 */
function getBrowserStackLaunchers(browserSetKey) {
  const browserSet = getBrowserSet(browserSetKey);

  const launchers = {};
  for (const browser of browserSet) {
    // Generate a key based on the browser information.
    const key = [
      browser.os || 'osDefault',
      browser.os_version || 'osVersionDefault',
      browser.browser || 'browserDefault',
      browser.browser_version || 'browserVersionDefault',
    ].join('_');

    launchers[key] = browser;
  }

  return launchers;
}

module.exports = getBrowserStackLaunchers;
