const crossSpawn = require('cross-spawn');
const minimist = require('minimist');

const argv = minimist(process.argv.slice(2));

function runE2eTests() {
  try {
    process.env.SKY_UX_PROTRACTOR_PROJECT_ROOT = argv['project-root'];

    const result = crossSpawn.sync(
      'npx',
      [
        '-p',
        '@angular/cli',
        'ng',
        'e2e',
        '--protractor-config=./node_modules/@skyux-sdk/pipeline-settings/platforms/ado/protractor/protractor.angular-cli.conf.js',
      ],
      { stdio: 'inherit', cwd: process.cwd() }
    );

    console.log('RESULT:', result);

    if (result.exit) {
      console.log('The command `ng e2e` failed.');
      process.exit(1);
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

runE2eTests();
