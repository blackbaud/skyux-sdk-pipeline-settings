const fs = require('fs-extra');
const path = require('path');

// Setup playwright before everything else.
require('../../shared/playwright-browsers')();

const applyDefaultConfig = require('../../shared/karma/karma.angular-cli.conf');
const applyCodeCoverageThresholdConfig = require('../../utility/apply-code-coverage-threshold-config');

function applyJUnitConfig(config) {
  config.reporters.push('junit');

  config.plugins.push(require('karma-junit-reporter'));

  config.junitReporter = {
    outputDir: require('path').join(process.cwd(), 'test-results'),
  };
}

function applyCoberturaConfig(config) {
  config.coverageReporter.reporters.push({ type: 'cobertura' });
}

module.exports = function (config) {
  const skyuxConfig = fs.readJsonSync(
    path.join(process.cwd(), 'skyuxconfig.json')
  );

  applyDefaultConfig(config);
  applyJUnitConfig(config);
  applyCoberturaConfig(config);

  config.set({
    browserDisconnectTimeout: 6e5,
    browserDisconnectTolerance: 2,
    browserNoActivityTimeout: 6e5,
    captureTimeout: 6e5,
  });

  applyCodeCoverageThresholdConfig(
    config,
    skyuxConfig?.pipelineSettings?.testSettings?.unit?.codeCoverageThreshold ??
      skyuxConfig?.pipelineSettings?.vsts?.testSettings?.unit
        ?.codeCoverageThreshold ?? {
        branches: 0,
        functions: 0,
        lines: 0,
        statements: 0,
      }
  );
};
