const browserstack = require('browserstack-local');
const mergeWith = require('lodash.mergewith');

// This is what ties the tests to the local tunnel that's created.
const id = `skyux-spa-${new Date().getTime()}`;

let bsLocal;

function applyBrowserStackProtractorConfig(protractorConfig, options) {
  const browserStackOverrides = {
    browserstackUser: options.browserStackUsername,
    browserstackKey: options.browserStackKey,
    capabilities: {
      browserName: 'Chrome',
      browser_version: 'latest',
      chromeOptions: {
        args: [
          'incognito',
          '--disable-dev-shm-usage',
          '--disable-extensions',
          '--disable-gpu',
          '--headless',
          '--ignore-certificate-errors',
          '--no-sandbox',
          '--start-maximized',
          '--window-size=1000,800',
        ],
      },
      build: options.buildId,
      name: 'ng e2e',
      os: 'Windows',
      os_version: '10',
      project: options.projectName,
      'browserstack.console': 'verbose',
      'browserstack.debug': 'true',
      'browserstack.local': 'true',
      'browserstack.localIdentifier': id,
      'browserstack.networkLogs': 'true',
      'browserstack.selenium_version': '2.53.1',
      'browserstack.use_w3c': 'false',
    },
    directConnect: false,
    allScriptsTimeout: 11000,

    beforeLaunch: function () {
      console.log('Connecting to BrowserStack Local...');
      return new Promise(function (resolve, reject) {
        bsLocal = new browserstack.Local();
        bsLocal.start(
          {
            key: options.browserStackKey,
            onlyAutomate: true,
            forceLocal: true,
            force: true,
            localIdentifier: id,
            verbose: true,
          },
          function (error) {
            if (error) return reject(error);
            console.log('Connected. Now testing...');

            resolve();
          }
        );
      });
    },

    // Code to stop browserstack local after end of test
    afterLaunch: function () {
      return new Promise(function (resolve) {
        bsLocal.stop(resolve);
      });
    },
  };

  protractorConfig = mergeWith(
    protractorConfig,
    browserStackOverrides,
    function (originalValue, overrideValue) {
      if (Array.isArray(originalValue)) {
        return overrideValue;
      }
    }
  );

  return protractorConfig;
}

module.exports = applyBrowserStackProtractorConfig;
