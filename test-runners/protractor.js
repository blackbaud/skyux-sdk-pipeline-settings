const crossSpawn = require('cross-spawn');
const minimist = require('minimist');

const argv = minimist(process.argv.slice(2));

function runE2eTests() {
  try {
    const platform = argv['platform'];
    if (!platform) {
      throw new Error('The argument `--platform` is required!');
    }

    const projectName = argv['project-name'];
    if (!projectName) {
      throw new Error('The argument `--project-name` is required!');
    }

    process.env.SKY_UX_PROTRACTOR_PROJECT_ROOT = argv['project-root'] || '';

    if (argv['browserstack-username']) {
      process.env.BROWSER_STACK_USERNAME = argv['browserstack-username'];
    }

    if (argv['browserstack-access-key']) {
      console.log(
        'SETTING BROWSER_STACK_ACCESS_KEY to:',
        argv['browserstack-access-key']
      );
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
        'e2e',
        projectName,
        `--protractor-config=./node_modules/@skyux-sdk/pipeline-settings/platforms/${platform}/protractor/protractor.angular-cli.conf.js`,
        '--webdriver-update=false',
      ],
      { stdio: 'inherit', cwd: process.cwd() }
    );

    if (result.status !== 0) {
      console.log(`Protractor failed with exit code(${result.status}).`);
      process.exit(1);
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

runE2eTests();
