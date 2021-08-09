const getBrowserStackLaunchers = require('./get-browserstack-launchers');
const logBrowserStackSession = require('./log-browserstack-session');

function applyBrowserStackKarmaConfig(config, browserSetKey) {
  const bsUsername = process.env.BROWSER_STACK_USERNAME;
  const bsAccessKey = process.env.BROWSER_STACK_ACCESS_KEY;
  const bsBuildId = process.env.BROWSER_STACK_BUILD_ID;
  const bsProject = process.env.BROWSER_STACK_PROJECT;

  if (!bsUsername) {
    throw Error('Please provide a BrowserStack username!');
  }

  if (!bsAccessKey) {
    throw new Error('Please provide a BrowserStack access key!');
  }

  const customLaunchers = getBrowserStackLaunchers(browserSetKey);

  config.set({
    customLaunchers,
    browsers: Object.keys(customLaunchers),
    browserStack: {
      accessKey: bsAccessKey,
      build: bsBuildId,
      enableLoggingForApi: true,
      name: 'ng test',
      project: bsProject,
      username: bsUsername,
    },
  });

  config.plugins.push(require('karma-browserstack-launcher'));

  // Create a custom plugin to log the BrowserStack session.
  config.reporters.push('blackbaud-browserstack');
  config.plugins.push({
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
