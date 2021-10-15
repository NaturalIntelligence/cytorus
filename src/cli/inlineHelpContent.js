module.exports = `
Following options are supported. You can also pass cypress run command arguments.

--spec <spec-file>              comma sperated path of spec files without space
--tags <tag-expression>         tag expression to run particular scenarios
--include <scenario-positions>  comma sperated list of scenario positions to run the tests
--exclude <scenario-positions>  comma sperated list of scenario positions to skip while running the tests
--specs-config <file.json>      json file path containing the configuration to run the tests.
--dist <false>                  Set it to true to not run tests in parallel
--dist-limit <number>           Number of parallel processes to run the tests

if you pass '--parallel' option, then '--dist' will be set to false.
`;