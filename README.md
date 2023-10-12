# @skyux-sdk/pipeline-settings

Configuration files for SKY UX applications when running on different CI platforms.

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
