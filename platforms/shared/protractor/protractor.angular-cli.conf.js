// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter, StacktraceOption } = require('jasmine-spec-reporter');
const path = require('path');

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
          '--window-size=1000,800',
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
        ignore: false,
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

  return config;
}

module.exports = getConfig;
