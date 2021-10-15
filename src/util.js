
/**
 * Parse time duration in redable format
 * @param {Number} duration time interval
 * @returns 
 */
 function durationToRedableFormat (duration) {
    const ms = parseInt((duration % 1000) / 100);
    const s = Math.floor((duration / 1000) % 60);
    const m = Math.floor((duration / (1000 * 60)) % 60);
    const h = Math.floor((duration / (1000 * 60 * 60)) % 24);
    return `${h}h ${m}m ${s}s ${ms}ms`;
}

/**
 * Parse time duration in redable format
 * @param {Number} time
 * @returns 
 */
 function timeToRedableFormat (time) {
    time = new Date(time);
    return `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}:${time.getMilliseconds()}`;
}


module.exports.durationToRedableFormat = durationToRedableFormat;
module.exports.timeToRedableFormat = timeToRedableFormat;