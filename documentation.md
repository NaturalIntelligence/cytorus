## Commands

To run tests tagged with @only and not tagged with @skip
```bash
$ npx cypress run
```

To run tests as per tag expression but skip tests with @skip
```bash
$ npx cypress run -e tags="@tag"
```

To run 1st scenario of all feature files.
```bash
$ npx cypress run -e include="[1]"
```

To run 1st scenario of selected feature files.
```bash
$ npx cypress run -e include="[1]" --spec "cypress/integration/features/google2.feature"

$ npx cypress run -e include="[1]" --spec "cypress/integration/features/google2.feature,cypress/integration/features/google.feature"
```

To skip 1st scenario of all feature files.
```bash
$ npx cypress run -e exclude="[1]"
```