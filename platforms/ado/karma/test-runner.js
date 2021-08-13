const crossSpawn = require('cross-spawn');
const minimist = require('minimist');

const argv = minimist(process.argv.slice(2));

function runCodeCoverage() {
  try {
    const projectName = argv['project-name'];

    process.env.BROWSER_STACK_USERNAME = argv['browserstack-username'];
    process.env.BROWSER_STACK_ACCESS_KEY = argv['browserstack-access-key'];
    process.env.BROWSER_STACK_BUILD_ID = argv['browserstack-build-id'];
    process.env.BROWSER_STACK_PROJECT = projectName;

    const result = crossSpawn.sync(
      'npx',
      [
        '-p',
        '@angular/cli',
        'ng',
        'test',
        projectName,
        '--karma-config=./node_modules/@skyux-sdk/pipeline-settings/platforms/ado/karma/karma.angular-cli.conf.js',
        '--watch=false',
        '--code-coverage',
      ],
      { stdio: 'inherit', cwd: process.cwd() }
    );

    if (result.exit) {
      console.log('The command `ng test` failed.');
      process.exit(1);
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

runCodeCoverage();
