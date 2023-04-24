function applyBrowserLauncherKarmaConfig(config, browserSetName) {
  const browsers = new Map();

  browsers.set('chrome', {
    launcher: require('karma-chrome-launcher'),
    name: 'ChromeHeadless_flags',
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

  let browserSets = {
    speedy: ['chrome'],
    quirky: ['chrome', 'edge'],
    paranoid: ['chrome', 'edge', 'firefox', 'safari'],
  };
  if (process.arch === 'arm64' && process.platform === 'linux') {
    // Edge is not available on Linux ARM64
    browserSets = {
      speedy: ['chrome'],
      quirky: ['chrome'],
      paranoid: ['chrome', 'firefox', 'safari'],
    };
  }

  const browserSet = browserSets[browserSetName];
  if (browserSet) {
    config.plugins.push(...browserSet.map((k) => browsers.get(k).launcher));
    config.browsers = browserSet.map((k) => browsers.get(k).name);
  }
}

module.exports = applyBrowserLauncherKarmaConfig;
