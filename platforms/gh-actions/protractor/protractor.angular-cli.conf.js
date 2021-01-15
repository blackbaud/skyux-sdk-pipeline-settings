// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

exports.config = {
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      binary: require('puppeteer').executablePath(),
      args: [
        '--disable-extensions',
        '--disable-gpu',
        '--headless',
        '--no-sandbox'
      ]
    }
  }
};
