const browserstack = require('browserstack-local');
const mergeWith = require('lodash.mergewith');

let bsLocal;

function applyBrowserStackProtractorConfig(config) {
  const browserStackKey = process.env.BROWSER_STACK_ACCESS_KEY;

  const browserStackOverrides = {
    browserstackUser: process.env.BROWSER_STACK_USERNAME,
    browserstackKey: browserStackKey,
    capabilities: {
      browserName: 'Chrome',
      chromeOptions: {
        args: [
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
      build: process.env.BROWSER_STACK_BUILD_ID,
      name: 'ng e2e',
      os: 'Windows',
      os_version: '10',
      project: process.env.BROWSER_STACK_PROJECT,
      'browserstack.debug': 'true',
      'browserstack.local': 'true',
    },
    directConnect: false,
    // SELENIUM_PROMISE_MANAGER: true,

    beforeLaunch: function () {
      console.log('Connecting to BrowserStack Local...');
      return new Promise(function (resolve, reject) {
        bsLocal = new browserstack.Local();
        bsLocal.start({ key: browserStackKey }, function (error) {
          if (error) return reject(error);
          console.log('Connected. Now testing...');

          resolve();
        });
      });
    },

    // Code to stop browserstack local after end of test
    afterLaunch: function () {
      return new Promise(function (resolve) {
        bsLocal.stop(resolve);
      });
    },
  };

  config = mergeWith(
    config,
    browserStackOverrides,
    function (originalValue, overrideValue) {
      if (Array.isArray(originalValue)) {
        return overrideValue;
      }
    }
  );

  return config;
}

module.exports = applyBrowserStackProtractorConfig;
