const getConfig = require('../../shared/protractor/protractor.angular-cli.conf');
const applyBrowserStackProtractorConfig = require('../../utility/apply-browserstack-protractor-config');

const config = getConfig();

if (process.env.VISUAL_BASELINES_ENABLE_BROWSERSTACK) {
  applyBrowserStackProtractorConfig(config);
}

exports.config = config;
