const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { nodeVersion } = require('./node-version');

let repoPath;

beforeEach(() => {
  repoPath = fs.mkdtempSync(path.join(os.tmpdir(), 'node-version-'));
});

afterEach(() => {
  fs.rmSync(repoPath, { recursive: true, force: true });
});

/**
 * Writes a package-lock.json exposing the given `@skyux/core` version.
 * @param {string|undefined} skyuxVersion - omit to simulate SKY UX absent.
 * @param {number} lockfileVersion - 3 (modern) or 2 (legacy).
 */
function writeLock(skyuxVersion, lockfileVersion = 3) {
  let lock;
  if (lockfileVersion > 2) {
    lock = {
      lockfileVersion,
      packages: skyuxVersion
        ? { 'node_modules/@skyux/core': { version: skyuxVersion } }
        : {},
    };
  } else {
    lock = {
      lockfileVersion,
      dependencies: skyuxVersion
        ? { '@skyux/core': { version: skyuxVersion } }
        : {},
    };
  }
  fs.writeFileSync(
    path.join(repoPath, 'package-lock.json'),
    JSON.stringify(lock)
  );
}

function writeNvmrc(contents) {
  fs.writeFileSync(path.join(repoPath, '.nvmrc'), contents);
}

test('reads SKY UX version from a modern (v3) lockfile', () => {
  writeLock('14.2.0', 3);
  assert.strictEqual(nodeVersion(repoPath), '24');
});

test('reads SKY UX version from a legacy (v2) lockfile', () => {
  writeLock('14.2.0', 2);
  assert.strictEqual(nodeVersion(repoPath), '24');
});

test('maps SKY UX 9 to Node 18', () => {
  writeLock('9.5.0');
  assert.strictEqual(nodeVersion(repoPath), '18');
});

test('maps SKY UX 10 to Node 20', () => {
  writeLock('10.0.0');
  assert.strictEqual(nodeVersion(repoPath), '20');
});

test('maps SKY UX 12 to Node 20', () => {
  writeLock('12.9.1');
  assert.strictEqual(nodeVersion(repoPath), '20');
});

test('maps SKY UX 13 to Node 22', () => {
  writeLock('13.0.0');
  assert.strictEqual(nodeVersion(repoPath), '22');
});

test('maps SKY UX 13 with next to Node 24', () => {
  writeLock('13.0.0');
  assert.strictEqual(nodeVersion(repoPath, true), '24');
});

test('maps SKY UX 14 to Node 24', () => {
  writeLock('14.0.0');
  assert.strictEqual(nodeVersion(repoPath), '24');
});

test('maps SKY UX 15 to Node 24', () => {
  writeLock('15.1.2');
  assert.strictEqual(nodeVersion(repoPath), '24');
});

test('floors to Node 18 when SKY UX is absent', () => {
  writeLock(undefined);
  assert.strictEqual(nodeVersion(repoPath), '18');
});

test('floors to Node 18 when the SKY UX version is unparseable', () => {
  writeLock('not-a-version');
  assert.strictEqual(nodeVersion(repoPath), '18');
});

test('honors a valid exact .nvmrc value', () => {
  writeLock('14.0.0');
  writeNvmrc('20');
  assert.strictEqual(nodeVersion(repoPath), '20');
});

test('honors a .nvmrc patch version by its major', () => {
  writeLock('14.0.0');
  writeNvmrc('20.11.0\n');
  assert.strictEqual(nodeVersion(repoPath), '20');
});

test('ignores an unsupported .nvmrc value and falls through to the mapping', () => {
  writeLock('14.0.0');
  writeNvmrc('16');
  assert.strictEqual(nodeVersion(repoPath), '24');
});

test('ignores .nvmrc when next is set and SKY UX is present', () => {
  writeLock('13.0.0');
  writeNvmrc('20');
  assert.strictEqual(nodeVersion(repoPath, true), '24');
});

test('honors .nvmrc when next is set but SKY UX is absent', () => {
  writeLock(undefined);
  writeNvmrc('20');
  assert.strictEqual(nodeVersion(repoPath, true), '20');
});

test('throws when package-lock.json is missing', () => {
  assert.throws(() => nodeVersion(repoPath), /Unable to find package-lock/);
});

test('throws when the repo path is empty', () => {
  assert.throws(() => nodeVersion(''), /repo path is empty/);
});

test('throws when the repo path does not exist', () => {
  assert.throws(
    () => nodeVersion(path.join(repoPath, 'nope')),
    /does not exist/
  );
});
