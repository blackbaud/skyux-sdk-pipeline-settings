# @skyux-sdk/pipeline-settings

Configuration files for SKY UX applications when running on different CI platforms.

## Azure DevOps

### Karma testing

```
node ./node_modules/@skyux-sdk/pipeline-settings/test-runners/karma.js
  --platform=ado
  --project-name="$Env:angularDefaultProject"
  --browserstack-username="$(BrowserStackUser)"
  --browserstack-access-key="$(BrowserStackKey)"
  --browserstack-build-id="$(Build.BuildNumber)"
  --browserstack-project="$(Build.DefinitionName)"
```

## GitHub Actions

### Karma testing

```
node ./node_modules/@skyux-sdk/pipeline-settings/test-runners/karma.js
  --platform=gh-actions
  --project-name=
  --browserstack-username=
  --browserstack-access-key=
  --browserstack-build-id=
  --browserstack-project=
  --code-coverage-browser-set=paranoid
  --code-coverage-threshold-branches=
  --code-coverage-threshold-functions=
  --code-coverage-threshold-lines=
  --code-coverage-threshold-statements=
```
