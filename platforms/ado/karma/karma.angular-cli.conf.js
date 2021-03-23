// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.reporters.push('junit');

  config.set({
    autoWatch: false,
    singleRun: true,
    coverageReporter: {
      reporters: [
        { type: 'text-summary' },
        { type: 'cobertura' }
      ]
    },
    junitReporter: {
      outputDir: require('path').join(process.cwd(), 'test-results')
    }
  });
};
