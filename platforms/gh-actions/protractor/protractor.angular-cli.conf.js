// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

exports.config = {
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
