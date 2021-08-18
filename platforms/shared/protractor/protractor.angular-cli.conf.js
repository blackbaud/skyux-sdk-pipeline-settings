// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const browserstackLocal = require('browserstack-local');
const { SpecReporter, StacktraceOption } = require('jasmine-spec-reporter');
const path = require('path');
const { browser } = require('protractor');
const logBrowserStackSession = require('../../utility/log-browserstack-session');

// This is what ties the tests to the local tunnel that's created
const id = 'skyux-spa-' + new Date().getTime();

function getConfig() {
  const projectRoot = process.env.SKY_UX_PROTRACTOR_PROJECT_ROOT || '';

  const config = {
    allScriptsTimeout: 11000,
    specs: [path.join(process.cwd(), projectRoot, 'e2e/src/**/*.e2e-spec.ts')],
    capabilities: {
      browserName: 'chrome',
      chromeOptions: {
        args: [
          '--disable-dev-shm-usage',
          '--disable-extensions',
          '--disable-gpu',
          '--headless',
          '--ignore-certificate-errors',
          '--no-sandbox',
          '--start-maximized',
        ],
      },
    },
    directConnect: true,
    SELENIUM_PROMISE_MANAGER: false,
    baseUrl: 'http://localhost:4200/',
    framework: 'jasmine',
    jasmineNodeOpts: {
      showColors: true,
      defaultTimeoutInterval: 30000,
      print: function () {},
    },
    onPrepare() {
      require('ts-node').register({
        project: path.join(projectRoot, 'e2e/tsconfig.json'),
      });
      jasmine.getEnv().addReporter(
        new SpecReporter({
          spec: {
            displayStacktrace: StacktraceOption.PRETTY,
          },
        })
      );
    },
    params: {
      skyuxVisualRegressionTestingConfig: {
        compareScreenshot: {
          basePath: 'screenshots-baseline',
          diffPath: 'screenshots-diff',
          createdPath: 'screenshots-created',
          createdPathDiff: 'screenshots-created-diff',
          baseline: true,
          width: 1000,
          height: 800,
        },
      },
    },
  };

  if (process.env.BROWSER_STACK_USERNAME) {
    config.browserstackUser = process.env.BROWSER_STACK_USERNAME;
    config.browserstackKey = process.env.BROWSER_STACK_ACCESS_KEY;
    config.capabilities = {
      name: 'ng e2e',
      build: process.env.BROWSER_STACK_BUILD_ID,
      project: process.env.BROWSER_STACK_PROJECT,
      browser: 'chrome',
      browser_version: 'latest',
      os: 'Windows',
      os_version: '10',
      'browserstack.local': true,
      'browserstack.localIdentifier': id,
      'browserstack.networkLogs': true,
      'browserstack.debug': true,
      'browserstack.console': 'verbose',
      'browserstack.enable-logging-for-api': true,
    };

    config.beforeLaunch = function () {
      return new Promise(function (resolve, reject) {
        const bsConfig = {
          key: process.env.BROWSER_STACK_ACCESS_KEY,
          onlyAutomate: true,
          forceLocal: true,
          force: true,
          localIdentifier: id,
          verbose: true,
          'enable-logging-for-api': true,
        };

        exports.bsLocal = new browserstackLocal.Local();

        exports.bsLocal.start(bsConfig, function (error) {
          if (error) {
            console.log('Error connecting to BrowserStack.');
            reject(error);
          } else {
            console.log('Connected to Browserstack. Beginning e2e tests.');
            resolve();
          }
        });
      });
    };

    // Used to grab the Browserstack session
    config.onPrepare = () =>
      new Promise((resolve, reject) => {
        require('ts-node').register({ ignore: false });

        browser.driver
          .getSession()
          .then((session) => {
            logBrowserStackSession(session.getId());
            resolve();
          })
          .catch(reject);
      });

    // Used to close the Browserstack tunnel
    config.afterLaunc = () =>
      new Promise((resolve) => {
        if (exports.bsLocal) {
          console.log('Closing Browserstack connection.');
          exports.bsLocal.stop(resolve);
        } else {
          console.log('Not connected to Browserstack. Nothing to close.');
          resolve();
        }
      });
  }

  return config;
}

module.exports = getConfig;
