"use strict";

const fs = require('fs');
const path = require('path');
const isUUID = require('is-uuid');
const log4js = require('log4js');

log4js.configure('./config/log4js.json');
const logger = log4js.getLogger('console');

function debugLog(message) {
    //console.log('[' + (new Date()).toLocaleString() + ']: ' + message);
    logger.debug(message);
}

function replaceData(filePath, payload) {
    fs.readFile(filePath, 'utf8', function(err, data) {
        if (err) {
            debugLog('Error replacing string in file ' + filePath);
            return false;
        }

        let result = data;
        let hasCallback = false;
        if (payload.parameters) {
            payload.parameters.forEach(parameter => {
                if (parameter.key === 'webview.onDone') {
                    result = result.replace(/__CALLBACK_URL_PLACEHOLDER__/g, parameter.value);
                    hasCallback = true;
                }
                else {
                    const placeHolder = '__' + parameter.key.toUpperCase() + '_PLACEHOLDER__';
                    result = result.replace(placeHolder, parameter.value);
                }
            });
            if (!hasCallback) {
                debugLog('Error: request has no callback url');
                return false;
            }
        }

        // also need to change referenced resources from "/..." to "./..."
        // otherwise they will not be found
        result = result.replace(/"\//g, "\"./");

        fs.writeFile(filePath, result, "utf8", function(err) {
            if (err) {
                debugLog('Error writing to file ' + filePath);
                return false;
            }
        });
    });
    return true;
}

function mkdir(dir) {
    try {
        fs.mkdirSync(dir, 0o755);
    }
    catch (err) {
        if (err.code !== 'EEXIST') {
            debugLog('Error mkdir ' + dir);
        }
    }
}

function copyFile(src, dest) {
    fs.writeFileSync(dest, fs.readFileSync(src));
}

function copyDir(src, dest) {
    mkdir(dest);
    try {
        const files = fs.readdirSync(src);
        files.forEach((file, index) => {
            const srcFilePath = path.join(src, file);
            const destFilePath = path.join(dest, file);
            const current = fs.lstatSync(srcFilePath);
            if (current.isDirectory()) {
                copyDir(srcFilePath, destFilePath);
            }
            else if (current.isSymbolicLink()) {
                let symlink = fs.readlinkSync(srcFilePath);
                fs.symlinkSync(symlink, destFilePath);
            }
            else {
                copyFile(srcFilePath, destFilePath);
            }
        });
    }
    catch (err) {
        debugLog('Error reading dir ' + src);
    }
}

function rmdir(dir) {
    if (fs.existsSync(dir)) {
        const list = fs.readdirSync(dir);
        list.forEach((file, index) => {
            const filePath = path.join(dir, file);

            if (filePath != "." && filePath != "..") {
                const current = fs.lstatSync(filePath);
                if (current.isSymbolicLink()) {
                    fs.unlinkSync(filePath);
                }
                else if (current.isDirectory()) {
                    rmdir(filePath);
                }
                else {
                    fs.unlinkSync(filePath);
                }
            }
        });
        fs.rmdirSync(dir);
        debugLog('Removed dir: ' + dir);
    }
}

let webviewPath;

var setWebviewPath = function(path) {
    webviewPath = path;
};

// remove generated <uuid> directories if expired
function removeExpiredTempDirs() {
    const TIME_INTERVAL = 1800000; // 30 minutes
    const dir = __dirname + webviewPath;
    debugLog('Checking for any expired unused dir in ' + dir);
    try {
        const list = fs.readdirSync(dir);
        list.forEach((file, index) => {
            const filePath = path.join(dir, file);
            if (filePath != "." && filePath != "..") {
                if (file === 'template' || !isUUID.v4(file)) {
                    return;
                }

                const stat = fs.statSync(filePath);
                if (stat.isDirectory()) {
                    const delta = Math.abs(stat.atime.getTime() - Date.now());
                    // delete dir if older than specified time interval
                    if (delta > TIME_INTERVAL * 10) { // 5 hours
                        debugLog('Removing dir: ' + filePath);
                        rmdir(filePath);
                    }
                }
            }
        });
    }
    catch (err) {
        debugLog('Error occurred when checking for expired dir in ' + dir);
    }
    setTimeout(removeExpiredTempDirs, TIME_INTERVAL);
};

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    "copyDir": copyDir,
    "debugLog": debugLog,
    "replaceData": replaceData,
    "removeExpiredTempDirs": removeExpiredTempDirs,
    "setWebviewPath": setWebviewPath,
    "sleep": sleep
};
