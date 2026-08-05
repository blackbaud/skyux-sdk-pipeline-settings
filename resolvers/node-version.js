#!/usr/bin/env node

const fs = require('node:fs');

const node18 = '18';
const node20 = '20';
const node22 = '22';
const node24 = '24';

const supportedNvmrcVersions = [node18, node20, node22, node24];

// Returned for a deactivated project (see `isDeactivated`) that has no
// package-lock.json to inspect.
const defaultNodeVersion = node24;

/**
 * Checks whether a SKY UX project has been deactivated, based on its
 * skyuxconfig.json.
 *
 * @param {string} repoPath - Path to the SKY UX project folder.
 * @returns {boolean} True when skyuxconfig.json exists and has `deactivated: true`.
 */
function isDeactivated(repoPath) {
  const skyuxConfigPath = `${repoPath}/skyuxconfig.json`;
  if (!fs.existsSync(skyuxConfigPath)) {
    return false;
  }
  try {
    const skyuxConfig = JSON.parse(fs.readFileSync(skyuxConfigPath, 'utf-8'));
    return skyuxConfig.deactivated === true;
  } catch (e) {
    return false;
  }
}

/**
 * Resolves the major Node.js version a SKY UX project should build with,
 * based on the installed `@skyux/core` version found in its package-lock.json.
 *
 * If `repoPath` has no package-lock.json, this throws — except for a
 * deactivated project (a skyuxconfig.json with `deactivated: true`) that also
 * has no `.nvmrc`, in which case it returns the latest supported Node.js
 * version instead.
 *
 * @param {string} repoPath - Path to the SKY UX project folder.
 * @param {boolean} [next] - When true, resolve the version for the *next*
 *   release line of SKY UX rather than the current one.
 * @returns {string} The Node.js major version (e.g. '24').
 */
function nodeVersion(repoPath, next) {
  if (!repoPath) {
    throw new Error('The repo path is empty.');
  }

  if (!fs.existsSync(repoPath)) {
    throw new Error(`The repo path does not exist: ${repoPath}`);
  }

  const nvmrcPath = `${repoPath}/.nvmrc`;
  const packageLockPath = `${repoPath}/package-lock.json`;
  if (!fs.existsSync(packageLockPath)) {
    if (!fs.existsSync(nvmrcPath) && isDeactivated(repoPath)) {
      return defaultNodeVersion;
    }
    throw new Error(
      `Unable to find package-lock.json in the repo path: ${repoPath}`
    );
  }

  const packageLock = JSON.parse(fs.readFileSync(packageLockPath, 'utf-8'));
  const packageLockVersion = packageLock.lockfileVersion;
  let skyuxVersion;
  try {
    if (packageLockVersion > 2) {
      skyuxVersion =
        packageLock['packages']['node_modules/@skyux/core'].version || '0';
    } else {
      skyuxVersion = packageLock['dependencies']['@skyux/core'].version || '0';
    }
  } catch (e) {
    skyuxVersion = '0';
  }

  const skyuxMajorVersion = parseInt(
    skyuxVersion.replace(/^[^0-9]*([0-9]+)[.].*$/, '$1')
  );

  if (fs.existsSync(nvmrcPath) && (!next || skyuxMajorVersion === 0)) {
    const nvmrcVersion = fs.readFileSync(nvmrcPath, 'utf-8').trim() || '0';
    if (supportedNvmrcVersions.includes(nvmrcVersion)) {
      return nvmrcVersion;
    }
    const majorVersion = supportedNvmrcVersions.find((v) =>
      nvmrcVersion.startsWith(`${v}.`)
    );
    if (majorVersion) {
      return majorVersion;
    }
  }

  if (skyuxMajorVersion >= 14) {
    return node24;
  }
  if (skyuxMajorVersion >= 13) {
    return next ? node24 : node22;
  }
  if (skyuxMajorVersion >= 10) {
    return node20;
  }

  return node18;
}

module.exports = { nodeVersion };

// If this script was called directly, run it.
if (require.main === module) {
  const repoPath = process.argv[2];
  const next = process.argv[3] === 'true';
  try {
    process.stdout.write(`${nodeVersion(repoPath, next)}\n`);
  } catch (e) {
    process.stderr.write(`ERROR ${e.message}\n`);
    process.exit(1);
  }
}
