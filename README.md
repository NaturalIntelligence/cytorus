# Cytorus

Cypress Preprocessor

Cytorus is cucumon implementation of Cypress. Cucumon is nothing but gherkin like feature file with a few extra features.

## Features

* **Threshold** based approach to fail a build. This feature is very helpful for CI/CD. Your build can be green with flaky or timebound tests. You can keep the build green for particular features while other failing tests are still being fixed.
* **Parallel run**: Cytorus analyze the number of parallel processes it can run to run the tests in parallel. However, you can control the limit or parallel features anytime.
* **Custom Analyzer**: You can wrte your own logic to build reports or to analyze final result.
* **Cucumon Syntax support**: Cucumon instruction help to reduce code to convert data table and doc strings in other format. 
    ```fature
    Given the following query params
        #> {}
        | from | XML  |
        | to   | JSON |
    ```

    Step definition will get following converted object;
    ```js
    {
        from: "XML",
        to: "JSON"
    }
    ```

    `{}`, `[]`, and `[{}]` are currently supported for data table. `json` are supported for doc string.

* Cytorus allow you to run tests by their **position** in partifular feature file. It can help you when you have some automation logic to identify tests to run without adding tags or doing any change in the repository.
* **Debugging**: Cytorus adds informative message with each step to display in command pannel or console logs on Cypress dashboard. You can also run cytorus with debug option `DEBUG=cytorus npx cytorus run`

Minor features
* Cytorus skips tests marked with `@skip`.
* If some tests are marked with `@only` then other tags will be skipped.


Many features are on the way

## Setup
Install
```bash
$ mkdir project; cd project
$ npm init -y

#install cypress dependencies if you have not installed them yet
$ sudo apt-get install xvfb libgtk-3-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libgconf2-4
#install necessary projects
$ npm install cypress cytorus cytorus-report
```

Create the following folder structure
```
project
    |__ cypress
        |__ integration
            |__ features
            |__ steps
            |__ other
        |__ fixtures
        |__ plugins
        |__ reports
        |__ support
    |__ cypress.json
    |__ cytorus.config.js
    |__ package.json

```

You can check E2E folder for more detail.

Cytorus is interested in only `cypress/integration/features/`, `cypress/integration/steps/`, and `cytorus.config.js`. Rest config is as per cypress need.

Following configuration is required in `cypress/plugins/index.js`

```js
const cytorus = require('cytorus');
module.exports = (on, config) => {
  cytorus(on, config);
}

```

## Documentation

Detail instructions can be found in [docs](/docs).