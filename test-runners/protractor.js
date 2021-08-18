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

    const result = crossSpawn.sync(
      'npx',
      [
        '-p',
        '@angular/cli',
        'ng',
        'e2e',
        projectName,
        `--protractor-config=./node_modules/@skyux-sdk/pipeline-settings/platforms/${platform}/protractor/protractor.angular-cli.conf.js`,
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
