const applyDefaultConfig = require('../../shared/karma/karma.angular-cli.conf');
const applyCodeCoverageThresholdConfig = require('../../utility/apply-code-coverage-threshold-config');
const applyBrowserStackKarmaConfig = require('../../utility/apply-browserstack-karma-config');

module.exports = function (config) {
  applyDefaultConfig(config);

  // Add support for Codecov reports.
  config.coverageReporter.reporters.push({ type: 'lcovonly' });

  applyCodeCoverageThresholdConfig(config);
  applyBrowserStackKarmaConfig(config);
};
