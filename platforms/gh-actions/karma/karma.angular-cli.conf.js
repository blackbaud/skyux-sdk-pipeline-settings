const applyDefaultConfig = require('../../shared/karma/karma.angular-cli.conf');
const applyCodeCoverageThresholdConfig = require('../../utility/apply-code-coverage-threshold-config');
const applyBrowserStackKarmaConfig = require('../../utility/apply-browserstack-karma-config');

module.exports = function (config) {
  applyDefaultConfig(config);

  // Add support for Codecov reports.
  config.coverageReporter.reporters.push({ type: 'lcovonly' });

  applyCodeCoverageThresholdConfig(config, {
    branches: parseInt(
      process.env.SKY_UX_CODE_COVERAGE_THRESHOLD_BRANCHES || '0',
      10
    ),
    functions: parseInt(
      process.env.SKY_UX_CODE_COVERAGE_THRESHOLD_FUNCTIONS || '0',
      10
    ),
    lines: parseInt(
      process.env.SKY_UX_CODE_COVERAGE_THRESHOLD_LINES || '0',
      10
    ),
    statements: parseInt(
      process.env.SKY_UX_CODE_COVERAGE_THRESHOLD_STATEMENTS || '0',
      10
    ),
  });

  applyBrowserStackKarmaConfig(config);
};
