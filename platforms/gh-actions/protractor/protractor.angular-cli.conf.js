/*global browser*/

const browserstack = require('browserstack-local');
const { SpecReporter, StacktraceOption } = require('jasmine-spec-reporter');
const mergeWith = require('lodash.mergewith');
const path = require('path');

const getConfig = require('../../shared/protractor/protractor.angular-cli.conf');
const logBrowserStackSession = require('../../utility/log-browserstack-session');

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
    build: process.env.BROWSER_STACK_BUILD_ID,
    name: 'ng e2e',
    browserName: 'Chrome',
    os: 'Windows',
    os_version: '10',
    project: process.env.BROWSER_STACK_PROJECT,
    'browserstack.console': 'verbose',
    'browserstack.debug': 'true',
    'browserstack.enable-logging-for-api': true,
    'browserstack.local': 'true',
    'browserstack.networkLogs': true,
  },
  directConnect: false,
  onPrepare: function () {
    return new Promise((resolve, reject) => {
      require('ts-node').register({
        ignore: false,
        project: path.join(
          process.env.SKY_UX_PROTRACTOR_PROJECT_ROOT,
          'e2e/tsconfig.json'
        ),
      });

      jasmine.getEnv().addReporter(
        new SpecReporter({
          spec: {
            displayStacktrace: StacktraceOption.PRETTY,
          },
        })
      );

      browser.driver
        .getSession()
        .then((session) => {
          logBrowserStackSession(session.getId());
          resolve();
        })
        .catch(reject);
    });
  },
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
