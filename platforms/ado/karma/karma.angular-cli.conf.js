const applyDefaultConfig = require('../../shared/karma/karma.angular-cli.conf');
const applyCodeCoverageThresholdConfig = require('../../utility/apply-code-coverage-threshold-config');
const applyBrowserStackKarmaConfig = require('../../utility/apply-browserstack-karma-config');

function applyJUnitConfig(config) {
  config.reporters.push('junit');

  config.plugins.push(require('karma-junit-reporter'));

  config.junitReporter = {
    outputDir: require('path').join(process.cwd(), 'test-results'),
  };
}

module.exports = function (config) {
  applyDefaultConfig(config);
  applyJUnitConfig(config);
  applyCodeCoverageThresholdConfig(config);
  applyBrowserStackKarmaConfig(config);
};
