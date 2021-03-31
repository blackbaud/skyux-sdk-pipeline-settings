// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

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
    },
    // ADO doesn't render default symbols well.
    mochaReporter: {
      symbols: {
        success: '+',
        info: '#',
        warning: '!',
        error: 'x'
      }
    },

    logLevel: config.LOG_DEBUG,

    browserDisconnectTimeout: 6e5,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 6e5,
    captureTimeout: 6e5
  });
};
