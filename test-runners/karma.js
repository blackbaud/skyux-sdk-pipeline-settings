const crossSpawn = require('cross-spawn');
const minimist = require('minimist');

const argv = minimist(process.argv.slice(2));

function runCodeCoverage() {
  try {
    const platform = argv['platform'];
    const projectName = argv['project-name'];

    if (!platform) {
      throw new Error('The argument `--platform` is required!');
    }

    if (!projectName) {
      throw new Error('The argument `--project-name` is required!');
    }

    if (argv['code-coverage-browser-set']) {
      process.env.SKY_UX_CODE_COVERAGE_BROWSER_SET =
        argv['code-coverage-browser-set'];
    }

    if (argv['code-coverage-threshold-branches']) {
      process.env.SKY_UX_CODE_COVERAGE_THRESHOLD_BRANCHES =
        argv['code-coverage-threshold-branches'];
    }

    if (argv['code-coverage-threshold-functions']) {
      process.env.SKY_UX_CODE_COVERAGE_THRESHOLD_FUNCTIONS =
        argv['code-coverage-threshold-functions'];
    }

    if (argv['code-coverage-threshold-lines']) {
      process.env.SKY_UX_CODE_COVERAGE_THRESHOLD_LINES =
        argv['code-coverage-threshold-lines'];
    }

    if (argv['code-coverage-threshold-statements']) {
      process.env.SKY_UX_CODE_COVERAGE_THRESHOLD_STATEMENTS =
        argv['code-coverage-threshold-statements'];
    }

    if (argv['browserstack-username']) {
      process.env.BROWSER_STACK_USERNAME = argv['browserstack-username'];
    }

    if (argv['browserstack-access-key']) {
      process.env.BROWSER_STACK_ACCESS_KEY = argv['browserstack-access-key'];
    }

    if (argv['browserstack-build-id']) {
      process.env.BROWSER_STACK_BUILD_ID = argv['browserstack-build-id'];
    }

    if (argv['browserstack-project']) {
      process.env.BROWSER_STACK_PROJECT = argv['browserstack-project'];
    }

    const result = crossSpawn.sync(
      'npx',
      [
        '-p',
        '@angular/cli',
        'ng',
        'test',
        projectName,
        `--karma-config=./node_modules/@skyux-sdk/pipeline-settings/platforms/${platform}/karma/karma.angular-cli.conf.js`,
        '--watch=false',
        '--code-coverage',
      ],
      { stdio: 'inherit', cwd: process.cwd() }
    );

    if (result.status !== 0) {
      console.log(`Karma failed with exit code (${result.status}).`);
      process.exit(1);
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

runCodeCoverage();
