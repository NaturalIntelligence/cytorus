When you run Cytorus, it tells you number of tests it is gonna run and number of processed it feels can be run in parallel to reduce test run time.

```bash
$ npx cytorus run
Checking CLI arguments
Building Cypress configuration
Analyzing if tests can run in parallel
Total scenarios to run:  20
I feel 4 processes are fine to run in parallel
Loading project configuration file for cytorus
Preparing processes to run tests
```

Once all the tests are finished, it matches the result with expected threhold settings. And prints the summary in last.

```bash
  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
    Status    :   ❌ Failed 
    Reason    :   the scenario 2.0 was expected to be passed
    Strategy  :   {"file":"cypress/integration/features/google.feature","pass":[2]}
    Stats     :   Passed: 15
                  Failed: 4
                  Missing Steps: 1
                  Skipped: 12
    Duration  :   0h 0m 37s 2ms
  └────────────────────────────────────────────────────────────────────────────────────────────────┘
```

It is not necessary that if all the tests are passing then the result will also be passed and vice versa. It is completely dependent on threshold config.

### Debug

If cytorus command fails and exit abnormally due to parsing or any other unknown error, you can run it in debug mode as following;

```bash
$ DEBUG=cytorus npx cytorus run
```

You will see many logs on the CLI.

## Command

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

To run 1st scenario and 2nd example of 2nd scenario( outline) of all feature files.
```bash
$ npx cypress run -e exclude="[1, 2.1]"
```

