// console.log("log4js loading ")
// const log4js = require("log4js");

// console.log("log4js: " + log4js)
// const logger = log4js.getLogger();
// logger.level = "debug";

/**
 * 日志打印
 */
const myLogger = {
    /**
     *
     * @param {String} message
     * @param  {...any} args 
     */
    debug: (message, ...args) => {
        console.log(message, ...args);
        // logger.debug(message, ...args);
    },

    info: (message, ...args) => {
        console.log(message, ...args);
        // logger.info(message, ...args);
    },

    warn: (message, ...args) => {
        console.log(message, ...args);
        // logger.warn(message, ...args);
    },
    error: (message, ...args) => {
        console.log(message, ...args);
        // logger.error(message, ...args);
    },

    fatal: (message, ...args) => {
        console.log(message, ...args);
        // logger.fatal(message, ...args);
    }
}

export default myLogger;