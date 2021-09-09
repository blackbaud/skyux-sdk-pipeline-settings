function applyCodeCoverageThresholdConfig(karmaConfig, codeCoverageThreshold) {
  const defaults = {
    branches: 0,
    functions: 0,
    lines: 0,
    statements: 0,
  };

  const { branches, functions, lines, statements } = Object.assign(
    {},
    defaults,
    codeCoverageThreshold
  );

  console.log(`
Code coverage thresholds set to:
 - branches ${branches}%
 - functions ${functions}%
 - lines ${lines}%
 - statements ${statements}%
`);

  karmaConfig.coverageReporter.check = {
    global: {
      branches,
      functions,
      lines,
      statements,
    },
  };
}

module.exports = applyCodeCoverageThresholdConfig;
