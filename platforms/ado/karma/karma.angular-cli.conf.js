// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const applyBrowserStackKarmaConfig = require('../../utility/apply-browserstack-karma-config');

function applyJUnitConfig(config) {
  config.reporters.push('junit');

  config.plugins.push(
    require('karma-junit-reporter')
  );

  config.junitReporter = {
    outputDir: require('path').join(process.cwd(), 'test-results')
  };
}

module.exports = function (config) {
  applyJUnitConfig(config);

  config.set({
    autoWatch: false,
    singleRun: true,
    coverageReporter: {
      reporters: [
        { type: 'text-summary' },
        { type: 'cobertura' }
      ]
    }
  });

  if (process.env.SKY_UX_CODE_COVERAGE_BROWSER_SET) {
    applyBrowserStackKarmaConfig(config);
  }
};
