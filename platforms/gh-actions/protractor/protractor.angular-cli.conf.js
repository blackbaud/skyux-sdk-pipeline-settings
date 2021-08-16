// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter, StacktraceOption } = require('jasmine-spec-reporter');
const path = require('path');

const projectRoot = process.env.PROJECT_ROOT || '';

exports.config = {
  allScriptsTimeout: 11000,
  specs: [path.join(process.cwd(), projectRoot, 'e2e/src/**/*.e2e-spec.ts')],
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
