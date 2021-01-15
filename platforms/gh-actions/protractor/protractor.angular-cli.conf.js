// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

exports.config = {
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      binary: require('puppeteer').executablePath(),
      args: [
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--disable-gpu',
        '--headless',
        '--ignore-certificate-errors',
        '--no-sandbox',
        '--start-maximized'
      ]
    }
  }
};
