/*global browser*/
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const browserstackLocal = require('browserstack-local');
const { SpecReporter, StacktraceOption } = require('jasmine-spec-reporter');
const path = require('path');
const logBrowserStackSession = require('../../utility/log-browserstack-session');

// This is what ties the tests to the local tunnel that's created
const id = 'skyux-lib-' + new Date().getTime();

function commonOnPrepare(projectRoot) {
  const e2eTsconfigPath = path.join(projectRoot, 'e2e/tsconfig.json');

  console.log(`Locating e2e tsconfig.json file at "${e2eTsconfigPath}"...`);

  require('ts-node').register({
    ignore: false,
    project: e2eTsconfigPath,
  });

  jasmine.getEnv().addReporter(
    new SpecReporter({
      spec: {
        displayStacktrace: StacktraceOption.PRETTY,
      },
    })
  );
}

function getConfig() {
  const projectRoot = process.env.SKY_UX_PROTRACTOR_PROJECT_ROOT || '';

  console.log(`Starting Protractor at project root: "${projectRoot}"`);

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
      commonOnPrepare(projectRoot);
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
    delete config.baseUrl;

    config.browserstackUser = process.env.BROWSER_STACK_USERNAME;
    config.browserstackKey = process.env.BROWSER_STACK_ACCESS_KEY;
    config.directConnect = false;

    config.capabilities = {
      name: 'ng e2e',
      build: process.env.BROWSER_STACK_BUILD_ID,
      project: process.env.BROWSER_STACK_PROJECT,
      browserName: 'Chrome',
      browserVersion: 'latest',
      'browserstack.os': 'Windows',
      'browserstack.osVersion': '10',
      'browserstack.local': true,
      'browserstack.localIdentifier': id,
      'browserstack.networkLogs': true,
      'browserstack.debug': true,
      'browserstack.console': 'verbose',
      'browserstack.enable-logging-for-api': true,
    };

    // config.capabilities = {
    //   'browserstack.enable-logging-for-api': true,
    //   'bstack:options': {
    //     os: 'Windows',
    //     osVersion: '10',
    //     projectName: process.env.BROWSER_STACK_PROJECT,
    //     buildName: process.env.BROWSER_STACK_BUILD_ID,
    //     sessionName: 'ng e2e',
    //     local: true,
    //     localIdentifier: id,
    //     debug: true,
    //     consoleLogs: 'verbose',
    //     networkLogs: true,
    //     userName: process.env.BROWSER_STACK_USERNAME,
    //     accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
    //   },
    //   browserName: 'Chrome',
    //   browserVersion: 'latest',
    // };

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
        commonOnPrepare(projectRoot);

        browser.driver
          .getSession()
          .then((session) => {
            logBrowserStackSession(session.getId());
            resolve();
          })
          .catch(reject);
      });

    // Used to close the Browserstack tunnel
    config.afterLaunch = () =>
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

  console.log('Running protractor with config:\n', config);

  return config;
}

module.exports = getConfig;
