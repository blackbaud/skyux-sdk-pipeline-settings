function getCodeCoverageThresholdPercent(threshold) {
  switch (threshold) {
    default:
    case 'none':
      return 0;

    case 'standard':
      return 80;

    case 'strict':
      return 100;
  }
}

function applyCodeCoverageThresholdConfig(config, threshold) {
  const thresholdPercent = getCodeCoverageThresholdPercent(threshold);

  config.coverageReporter.check = {
    global: {
      branches: thresholdPercent,
      functions: thresholdPercent,
      lines: thresholdPercent,
      statements: thresholdPercent,
    },
  };
}

module.exports = applyCodeCoverageThresholdConfig;
