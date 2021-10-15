function errMsg(result, stats, testDuration){
    return  `
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
    Status    :   ❌ Failed 
    Reason    :   ${result.message}
                        ${JSON.stringify(result.strategy)}
    Stats     :    
                        Passed: ${stats.passed}
                        Failed: ${stats.failed}
                        Missing Steps: ${stats.missing}
                        Skipped: ${stats.skipped}
    Duration  :   ${testDuration}
└────────────────────────────────────────────────────────────────────────────────────────────────┘

    `;
}
function successMsg(result, stats, testDuration){
    return  `
    ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
        Status    :   ✔️  Passed
        Stats     :    
                            Passed: ${stats.passed}
                            Failed: ${stats.failed}
                            Missing Steps: ${stats.missing}
                            Skipped: ${stats.skipped}                                                         
        Duration  :   ${testDuration}                                                                       
    └────────────────────────────────────────────────────────────────────────────────────────────────┘
    
        `;
}

function separator(){
    return `
    ====================================================================================================
    `
}

module.exports = {
    errMsg: errMsg,
    successMsg: successMsg,
    separator: separator
}
