const applyDefaultConfig = require('../../shared/karma/karma.angular-cli.conf');
const applyBrowserStackKarmaConfig = require('../../utility/apply-browserstack-karma-config');

module.exports = function (config) {
  applyDefaultConfig(config);

  // Add support for Codecov.
  config.coverageReporter.reporters.push({ type: 'lcovonly' });

  // Apply code coverage thresholds.
  config.coverageReporter.check = {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  };

  applyBrowserStackKarmaConfig(config);
};
