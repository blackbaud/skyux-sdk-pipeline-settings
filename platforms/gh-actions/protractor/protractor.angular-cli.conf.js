// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

exports.config = {
  capabilities: {
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
  },
  params: {
    skyuxVisualRegressionTestingConfig: {
      compareScreenshot: {
        basePath: 'screenshots-baseline',
        diffPath: 'screenshots-diff',
        createdPath: 'screenshots-created',
        createdPathDiff: 'screenshots-created-diff',
        baseline: true,
        width: 1000,
        height: 800
      }
    }
  }
};
