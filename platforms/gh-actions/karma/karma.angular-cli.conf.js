const applyDefaultConfig = require('../../shared/karma/karma.angular-cli.conf');
const applyCodeCoverageThresholdConfig = require('../../utility/apply-code-coverage-threshold-config');
const applyBrowserStackKarmaConfig = require('../../utility/apply-browserstack-karma-config');

module.exports = function (config) {
  const codeCoverageBrowserSet = process.env.SKY_UX_CODE_COVERAGE_BROWSER_SET;
  const codeCoverageThreshold = process.env.SKY_UX_CODE_COVERAGE_THRESHOLD;

  applyDefaultConfig(config);

  // Add support for Codecov reports.
  config.coverageReporter.reporters.push({ type: 'lcovonly' });

  applyCodeCoverageThresholdConfig(config, codeCoverageThreshold);

  if (codeCoverageBrowserSet) {
    applyBrowserStackKarmaConfig(config, codeCoverageBrowserSet);
  } else {
    console.log(
      'A valid browser set was not defined in the pipeline; skipping BrowserStack testing.'
    );
  }
};
