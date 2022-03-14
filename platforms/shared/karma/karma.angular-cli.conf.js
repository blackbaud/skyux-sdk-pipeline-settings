// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

// NOTE: The contents of this file were copied directly from Angular CLI with minimal adjustments.

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
        random: false,
      },
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    coverageReporter: {
      dir: require('path').join(process.cwd(), './coverage'), // Angular sets this to './coverage/project-name' by default.
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_DEBUG,
    autoWatch: false, // Angular sets this to true by default.
    browsers: ['ChromeHeadless_flags'], // Angular sets this to 'Chrome' by default.
    customLaunchers: {
      ChromeHeadless_flags: {
        base: 'ChromeHeadless',
        flags: ['--disable-extensions', '--disable-gpu', '--no-sandbox'],
      },
    },
    chromeOptions: {},
    singleRun: true, // Angular sets this to false by default.
    restartOnFileChange: false, // Angular sets this to true by default.
    browserDisconnectTolerance: 3,
  });

  // Tell karma to wait for bundle to be completed before launching browsers.
  // See: https://github.com/karma-runner/karma-chrome-launcher/issues/154#issuecomment-986661937
  config.plugins.unshift(require('./plugins/karma.waitwebpack'));
  config.frameworks.unshift('waitwebpack');
};
