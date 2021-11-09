const getConfig = require('../../shared/protractor/protractor.angular-cli.conf');
const applyBrowserStackProtractorConfig = require('../../utility/apply-browserstack-protractor-config');

const config = getConfig();

if (process.env.BROWSER_STACK_USERNAME) {
  console.log('APPLYING BROWSER STACK CONFIG!');
  applyBrowserStackProtractorConfig(config);
}

exports.config = config;
