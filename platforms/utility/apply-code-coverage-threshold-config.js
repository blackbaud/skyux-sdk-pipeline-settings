function applyCodeCoverageThresholdConfig(config) {
  const branches = parseInt(
    process.env.SKY_UX_CODE_COVERAGE_THRESHOLD_BRANCHES || '0',
    10
  );
  const functions = parseInt(
    process.env.SKY_UX_CODE_COVERAGE_THRESHOLD_FUNCTIONS || '0',
    10
  );
  const lines = parseInt(
    process.env.SKY_UX_CODE_COVERAGE_THRESHOLD_LINES || '0',
    10
  );
  const statements = parseInt(
    process.env.SKY_UX_CODE_COVERAGE_THRESHOLD_STATEMENTS || '0',
    10
  );

  console.log(`
Code coverage thresholds set to:
 - branches ${branches}%
 - functions ${functions}%
 - lines ${lines}%
 - statements ${statements}%
`);

  config.coverageReporter.check = {
    global: {
      branches,
      functions,
      lines,
      statements,
    },
  };
}

module.exports = applyCodeCoverageThresholdConfig;
