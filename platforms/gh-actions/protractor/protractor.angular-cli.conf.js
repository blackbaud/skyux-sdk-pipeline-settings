// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter, StacktraceOption } = require('jasmine-spec-reporter');

exports.config = {
  allScriptsTimeout: 11000,
  specs: ['./src/**/*.e2e-spec.ts'],
  capabilities: {
    chromeOptions: {
      binary: require('puppeteer').executablePath(),
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
      project: require('path').join(__dirname, './tsconfig.json'),
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
