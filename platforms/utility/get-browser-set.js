const bsBrowserChrome = {
  base: 'BrowserStack',
  browser: 'Chrome',
  os: 'Windows',
  os_version: '10',
};

const bsBrowserEdge = {
  base: 'BrowserStack',
  browser: 'Edge',
  os: 'Windows',
  os_version: '10',
};

const bsBrowserFirefox = {
  base: 'BrowserStack',
  browser: 'Firefox',
  os: 'OS X',
  os_version: 'Big Sur',
};

const bsBrowserSafari = {
  base: 'BrowserStack',
  browser: 'Safari',
  os: 'OS X',
  os_version: 'Big Sur',
};

const browserSets = {
  speedy: [bsBrowserChrome],
  quirky: [bsBrowserChrome, bsBrowserEdge],
  paranoid: [bsBrowserChrome, bsBrowserEdge, bsBrowserFirefox, bsBrowserSafari],
};

function getBrowserSet(key) {
  const browserSet = browserSets[key];
  return browserSet;
}

module.exports = getBrowserSet;
