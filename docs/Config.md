Creates `cytorus.config.js` on project root with following structure;

```js
module.exports = {
    init: function(){
        //..
    },
    end: async function(){
        //..
    },
    threshold:[]
}
```

## Threshold

You can define various strategies to pass or fail the selected tests under threshold property. Eg.

```js
threshold:[{
        tagExpression: "@skip",
        max: 0
    },{
        file: "features/nested/dynamicArguments.feature",
        min: "100%"
    },{
        file: "integration/features/failing.feature",
        pass: [2],
        //fail: [1,3,4]
    },{
        file: "cypress/integration/features/google2.feature",
        min: 1
    },{
        tagExpression: () => /*logics to build tag expression*/ "@timebound" ,
        min: "100%",
        when: () => (new Date()).getHours() < 17
    }]
```