// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const getBrowserSet = require('../../utility/browser-set');
const logBrowserStackSession = require('../../utility/log-browserstack-session');

function getBrowserStackLaunchers() {
  const browserSet = getBrowserSet('paranoid');

  const launchers = {};
  for (const browser of browserSet) {
    // Generate a key based on the browser information.
    const key = [
      browser.os || 'osDefault',
      browser.os_version || 'osVersionDefault',
      browser.browser || 'browserDefault',
      browser.browser_version || 'browserVersionDefault'
    ].join('_');

    launchers[key] = browser;
  }

  return launchers;
}

function applyBrowserStackConfig(config) {
  const bsUsername = process.env.BROWSER_STACK_USERNAME;
  const bsAccessKey = process.env.BROWSER_STACK_ACCESS_KEY;

  if (!bsUsername) {
    throw Error('Please provide a BrowserStack username!');
  }

  if (!bsAccessKey) {
    throw new Error('Please provide a BrowserStack access key!');
  }

  const customLaunchers = getBrowserStackLaunchers();

  config.set({
    customLaunchers,
    browsers: Object.keys(customLaunchers),
    browserStack: {
      accessKey: bsAccessKey,
      build: process.env.BROWSER_STACK_BUILD_ID,
      enableLoggingForApi: true,
      name: 'ng test',
      project: process.env.BROWSER_STACK_PROJECT,
      username: bsUsername
    }
  });

  config.plugins.push(require('karma-browserstack-launcher'));

  // Create a custom plugin to log the BrowserStack session.
  config.reporters.push('blackbaud-browserstack');
  config.plugins.push({
    'reporter:blackbaud-browserstack': [
      'type',
      function (/* BrowserStack:sessionMapping */ sessions) {
        this.onBrowserComplete = (browser) => logBrowserStackSession(sessions[browser.id]);
      }
    ]
  });
}

// Default config provided by Angular CLI.
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(process.cwd(), './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ],
      check: {
        global: {
          branches: 100,
          functions: 100,
          lines: 100,
          statements: 100,
        },
      },
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Chrome'],
    singleRun: true,
    restartOnFileChange: false
  });

  applyBrowserStackConfig(config);
};
