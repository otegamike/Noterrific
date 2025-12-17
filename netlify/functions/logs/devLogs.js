const path = require("path"); 
const fs = require("fs");
const logFilePath = path.join(__dirname, "devLogs.txt");
const logErrorPath = path.join(__dirname, "errorLogs.txt");

logEvent = (message , clear) => {
    try {
        if (clear) {
            fs.writeFileSync(logFilePath, '', 'utf8');
        }
        const timestamp = new Date().toISOString() ;
        const logMessage = `${timestamp} \t ${message}\n`;
        fs.appendFileSync(logFilePath, logMessage, "utf-8") ;
    } catch (err) {
        console.error("error saving to logFile", err.message, err) ;
    }
    
}

logErrorEvent = (message , clear) => {
    try {
        if (clear) {
            fs.writeFileSync(logErrorPath, '', 'utf8');
        }
        const timestamp = new Date().toISOString() ;
        const logMessage = `${timestamp} \t ${message}\n`;
        fs.appendFileSync(logFilePath, logMessage, "utf-8") ;
    } catch (err) {
        console.error("error saving to logErrorFile", err.message, err) ;
    }
    
}

module.exports = { logEvent, logErrorEvent }  ;

