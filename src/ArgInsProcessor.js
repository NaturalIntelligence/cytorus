function toJSON(arg){
    return JSON.parse(arg);
}

/**
 * Convert data-table 2d array to object
 * input
 * key | val
 * key2 | val2
 * @param {array} dt 
 * @returns {object}
 */
function toObj(dt){
    const obj = {};
    for (let index = 0; index < dt.length; index++) {
        const row = dt[index];
        obj[row[0]] = row[1];
    }
    return obj;
}

/**
 * Convert data-table 2d array to 1-d array
 * @param {array} dt 
 * @returns {array}
 */
function toArr(dt){
    const obj = [];
    for (let index = 0; index < dt.length; index++) {
        const row = dt[index];
        for (let cell_i = 0; cell_i < row.length; cell_i++) {
            obj.push(row[cell_i]);
        }
    }
    return obj;
}

/**
 * Convert data-table 2d array to 1-d array
 * input
 * col1 | col2 | col3
 * val1 | val2 | val3
 * val4 | val5 | val6
 * @param {array} dt 
 * @returns {array}
 */
function toListOfObj(dt){
    const list = Array(dt.length -1);
    const header = dt[0];
    for (let index = 1; index < dt.length; index++) {
        const row = dt[index];
        const rowObj = {};
        for (let cell_i = 0; cell_i < row.length; cell_i++) {
            rowObj[header[cell_i]] = row[ cell_i];
        }
        list[index - 1] = rowObj;
    }
    return list;
}

/**
 * 
 * @param {array} ins 
 * @param {array} dataTable 
 */
function processDataTable(ins, dataTable){
    if( ins === "[]") return toArr(dataTable);
    else if(ins === "{}") return toObj(dataTable);
    else if(ins === "[{}]") return toListOfObj(dataTable);
    else return dataTable;
}
/**
 * 
 * @param {string} ins 
 * @param {string} docString 
 */
function processDocString(ins, docString){
    if( ins === "json") return toJSON(docString);
    else return docString;
}


module.exports = {
    processDataTable: processDataTable,
    processDocString: processDocString,
}