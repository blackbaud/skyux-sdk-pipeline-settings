# @skyux-sdk/pipeline-settings

Configuration files for SKY UX applications when running on different CI platforms.

## Node.js version resolver

Resolves the Node.js major version a SKY UX project should build with, based on the
`@skyux/core` version found in the project's `package-lock.json`. Run it from the SKY UX
project folder; it prints **only** the major version to stdout.

```
node ./node_modules/@skyux-sdk/pipeline-settings/resolvers/node-version.js <repoPath> [next]
```

- `<repoPath>` — path to the SKY UX project folder (the one containing `package-lock.json`).
- `[next]` — pass `true` to resolve the version for the next release line of SKY UX
  (optional; defaults to the current line).

| SKY UX major         | Node.js | Node.js (`next`) |
| -------------------- | ------- | ---------------- |
| 14+                  | 24      | 24               |
| 13                   | 22      | 24               |
| 10–12                | 20      | 20               |
| Below 10 / not found | 18      | 18               |

A valid `.nvmrc` (`18`, `20`, `22`, or `24`) in the project folder overrides the mapping,
except when `next` is set and SKY UX is installed.

If `<repoPath>` does not contain a `package-lock.json`, the script fails — except for a
deactivated SKY UX project (a `skyuxconfig.json` with `"deactivated": true` and no
`.nvmrc`), in which case it returns the latest supported Node.js version (currently `24`).

## Azure DevOps

### Karma testing

```
node ./node_modules/@skyux-sdk/pipeline-settings/test-runners/karma.js
  --platform=ado
  --project-name="$Env:angularDefaultProject"
```

## GitHub Actions

### Karma testing

```
node ./node_modules/@skyux-sdk/pipeline-settings/test-runners/karma.js
  --platform=gh-actions
  --project-name=
  --code-coverage-browser-set=paranoid
  --code-coverage-threshold-branches=
  --code-coverage-threshold-functions=
  --code-coverage-threshold-lines=
  --code-coverage-threshold-statements=
```
