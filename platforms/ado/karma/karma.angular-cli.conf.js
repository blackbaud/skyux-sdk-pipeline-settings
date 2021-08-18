const fs = require('fs-extra');
const lodashGet = require('lodash.get');
const path = require('path');

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
  const skyuxConfig = fs.readJsonSync(
    path.join(process.cwd(), 'skyuxconfig.json')
  );

  applyDefaultConfig(config);
  applyJUnitConfig(config);

  applyCodeCoverageThresholdConfig(
    config,
    lodashGet(
      skyuxConfig,
      'pipelineSettings.vsts.testSettings.unit.codeCoverageThreshold',
      {
        branches: 0,
        functions: 0,
        lines: 0,
        statements: 0,
      }
    )
  );

  applyBrowserStackKarmaConfig(
    config,
    process.env.SKY_UX_CODE_COVERAGE_BROWSER_SET ||
      lodashGet(
        skyuxConfig,
        'pipelineSettings.vsts.testSettings.unit.browserSet',
        undefined
      ),
    {
      username: process.env.BROWSER_STACK_USERNAME,
      accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
      buildId: process.env.BROWSER_STACK_BUILD_ID,
      project: process.env.BROWSER_STACK_PROJECT,
    }
  );
};
