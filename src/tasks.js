// in plugins file
module.exports = {
    cucumon_log : () => {
        console.log("Inside task")
        console.log.apply(this, arguments);
        return null;
    }
}