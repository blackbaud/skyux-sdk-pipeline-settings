const browserstack = require('browserstack-local');
const mergeWith = require('lodash.mergewith');
const getConfig = require('../../shared/protractor/protractor.angular-cli.conf');

const commonConfig = getConfig();

function customizer(originalValue, overrideValue) {
  if (Array.isArray(originalValue)) {
    return overrideValue;
  }
}

const browserStackOverrides = {
  browserstackUser: process.env.BROWSER_STACK_USERNAME,
  browserstackKey: process.env.BROWSER_STACK_ACCESS_KEY,
  capabilities: {
    build: 'protractor-browserstack',
    name: 'local_test',
    browserName: 'chrome',
    'browserstack.local': 'true',
    'browserstack.debug': 'true',
  },
  directConnect: false,
  beforeLaunch: function () {
    console.log('Connecting local');
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

exports.config = mergeWith(commonConfig, browserStackOverrides, customizer);
