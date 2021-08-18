const getBrowserStackLaunchers = require('./get-browserstack-launchers');
const logBrowserStackSession = require('./log-browserstack-session');

function applyBrowserStackKarmaConfig(
  karmaConfig,
  codeCoverageBrowserSet,
  browserStackConfig
) {
  if (!codeCoverageBrowserSet) {
    console.log(
      'A valid browser set was not defined in the pipeline; skipping BrowserStack testing.'
    );
    return;
  }

  if (!browserStackConfig.username) {
    throw new Error('Please provide a BrowserStack username!');
  }

  if (!browserStackConfig.accessKey) {
    throw new Error('Please provide a BrowserStack access key!');
  }

  const customLaunchers = getBrowserStackLaunchers(codeCoverageBrowserSet);

  karmaConfig.set({
    customLaunchers,
    browsers: Object.keys(customLaunchers),
    browserStack: {
      accessKey: browserStackConfig.accessKey,
      build: browserStackConfig.buildId,
      enableLoggingForApi: true,
      name: 'ng test',
      project: browserStackConfig.project,
      username: browserStackConfig.username,
    },
  });

  karmaConfig.set({
    browserDisconnectTimeout: 60000,
    browserDisconnectTolerance: 2,
    browserNoActivityTimeout: 30000,
    captureTimeout: 60000,
  });

  karmaConfig.plugins.push(require('karma-browserstack-launcher'));

  // Create a custom plugin to log the BrowserStack session.
  karmaConfig.reporters.push('blackbaud-browserstack');
  karmaConfig.plugins.push({
    'reporter:blackbaud-browserstack': [
      'type',
      function (/* BrowserStack:sessionMapping */ sessions) {
        this.onBrowserComplete = (browser) =>
          logBrowserStackSession(sessions[browser.id]);
      },
    ],
  });
}

module.exports = applyBrowserStackKarmaConfig;
