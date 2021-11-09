const getConfig = require('../../shared/protractor/protractor.angular-cli.conf');
const applyBrowserStackProtractorConfig = require('../../utility/apply-browserstack-protractor-config');

const protractorConfig = getConfig();

if (process.env.SKY_UX_PROTRACTOR_BROWSER_STACK_ACCESS_KEY) {
  applyBrowserStackProtractorConfig(protractorConfig, {
    browserStackKey: process.env.SKY_UX_PROTRACTOR_BROWSER_STACK_ACCESS_KEY,
    browserStackUsername: process.env.SKY_UX_PROTRACTOR_BROWSER_STACK_USERNAME,
    buildId: process.env.SKY_UX_PROTRACTOR_BROWSER_STACK_BUILD_ID,
    projectName: process.env.SKY_UX_PROTRACTOR_BROWSER_STACK_PROJECT,
  });
}

exports.config = protractorConfig;
