const getConfig = require('../../shared/protractor/protractor.angular-cli.conf');
const applyBrowserStackProtractorConfig = require('../../utility/apply-browserstack-protractor-config');

const config = getConfig();

if (process.env.BROWSER_STACK_USERNAME) {
  console.log(
    'APPLYING BROWSER STACK CONFIG!',
    process.env.BROWSER_STACK_USERNAME?.length,
    process.env.BROWSER_STACK_USERNAME,
    typeof process.env.BROWSER_STACK_USERNAME,
    `[${process.env.BROWSER_STACK_USERNAME}]`
  );
  applyBrowserStackProtractorConfig(config);
}

exports.config = config;
