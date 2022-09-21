const fs = require('fs-extra');
const lodashGet = require('lodash.get');
const path = require('path');
// const playwright = require('playwright');

// TODO: Try without playwright to see if it works?
// process.env.CHROME_BIN = playwright.chromium.executablePath();
// process.env.FIREFOX_BIN = playwright.firefox.executablePath();
// process.env.WEBKIT_HEADLESS_BIN = playwright.webkit.executablePath();

const applyDefaultConfig = require('../../shared/karma/karma.angular-cli.conf');
const applyCodeCoverageThresholdConfig = require('../../utility/apply-code-coverage-threshold-config');

function applyJUnitConfig(config) {
  config.reporters.push('junit');

  config.plugins.push(require('karma-junit-reporter'));

  config.junitReporter = {
    outputDir: require('path').join(process.cwd(), 'test-results'),
  };
}

function applyCoberturaConfig(config) {
  config.coverageReporter.reporters.push({ type: 'cobertura' });
}

function applyBrowserLauncherConfig(config, browserSetName) {
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

module.exports = function (config) {
  const skyuxConfig = fs.readJsonSync(
    path.join(process.cwd(), 'skyuxconfig.json')
  );

  applyDefaultConfig(config);
  applyJUnitConfig(config);
  applyCoberturaConfig(config);

  config.set({
    browserDisconnectTimeout: 6e5,
    browserDisconnectTolerance: 2,
    browserNoActivityTimeout: 6e5,
    captureTimeout: 6e5,
  });

  applyCodeCoverageThresholdConfig(
    config,
    lodashGet(
      skyuxConfig,
      'pipelineSettings.vsts.testSettings.unit.codeCoverageThreshold',
      {
        branches: 0,
        functions: 0,
        lines: 0,
        statements: 0,
      }
    )
  );

  applyBrowserLauncherConfig(
    config,
    process.env.SKY_UX_CODE_COVERAGE_BROWSER_SET ||
      lodashGet(
        skyuxConfig,
        'pipelineSettings.vsts.testSettings.unit.browserSet',
        undefined
      )
  );
};
