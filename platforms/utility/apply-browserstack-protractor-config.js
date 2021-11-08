const browserstack = require('browserstack-local');
const mergeWith = require('lodash.mergewith');

function applyBrowserStackProtractorConfig(config) {
  const browserStackOverrides = {
    browserstackUser: process.env.BROWSER_STACK_USERNAME,
    browserstackKey: process.env.BROWSER_STACK_ACCESS_KEY,
    capabilities: {
      browserName: 'Chrome',
      build: process.env.BROWSER_STACK_BUILD_ID,
      name: 'ng e2e',
      os: 'Windows',
      os_version: '10',
      project: process.env.BROWSER_STACK_PROJECT,
      'browserstack.debug': 'true',
      'browserstack.local': 'true',
    },
    directConnect: false,

    beforeLaunch: function () {
      console.log('Connecting to BrowserStack Local...');
      return new Promise(function (resolve, reject) {
        exports.bs_local = new browserstack.Local();
        exports.bs_local.start(
          { key: exports.config['browserstackKey'] },
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
        exports.bs_local.stop(resolve);
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

exports.applyBrowserStackProtractorConfig = applyBrowserStackProtractorConfig;
