"use strict";

const bodyParser = require('body-parser');
const express = require('express');
const fqdn = require('fqdn');
const uuidv4 = require('uuid/v4');
const utils = require('./utils.js');

var postParamsPath;
var externalServiceUrl;
var localServicePort = 3001;
var webviewPath;

var setPostParamsPath = function(path) {
    postParamsPath = path;
};

var setGetWebviewPath = function(path) {
    webviewPath = path;
};

var setServiceUrl = function(url) {
    externalServiceUrl = url;
};

var getServiceUrl = function() {
    return externalServiceUrl;
};

var setServicePort = function(port) {
    localServicePort = port;
};

var getServicePort = function() {
    return localServicePort;
};

var createWebviewServer = function() {
    if (!postParamsPath) {
        utils.debugLog('Error: please specify the path for posting webview input parameters');
        process.exit(1);
    }
    if (!webviewPath) {
        utils.debugLog('Error: please specify the path for downloading the webview app');
        process.exit(1);
    }
    if (!externalServiceUrl) {
        fqdn(function(err, res) {
            if (err) {
                utils.debugLog('Error: unable to get the fully qualified domain name of the server');
                process.exit(1);
            }
            externalServiceUrl = 'http://' + res;
        });
    }
    utils.debugLog('Webview service starting on: ' + externalServiceUrl + ', port: ' + localServicePort);

    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(webviewPath, handleGetRequest);
    app.post(postParamsPath, handlePostRequest);

    utils.setWebviewPath(webviewPath);
    utils.removeExpiredTempDirs();

    return app;
};

function handleGetRequest(req, res, next) {
    const filePath = req.originalUrl;
    utils.debugLog('GET ' + req.protocol+'://' + req.get('host') + filePath);
    if (filePath.indexOf('template') > -1) {
        res.status(404).end('The requested resource is not available');
        return;
    }
    res.sendFile(__dirname + filePath);
}

function handlePostRequest(req, res) {
    utils.debugLog('POST ' + req.protocol+'://'+req.get('host')+req.originalUrl);
    utils.debugLog('Request body: ' + JSON.stringify(req.body));
    console.log("*** Request payload: ", req.body);

    const srcDir = __dirname + webviewPath + '/template';
    const uuid = uuidv4();
    const destDir = __dirname + webviewPath + '/' + uuid;

    // create temp dir for download
    utils.copyDir(srcDir, destDir);

    // for POST request, extract parameters and callback url from the JSON
    // payload and inject the data into index.html in the temp dir
    const targetFile = destDir + '/index.html';

    if (!utils.replaceData(targetFile, req.body)) {
        utils.debugLog('Injecting data to index.html failed');
        res.status(400).end('Error: failed to inject data to web app');
        return;
    }

    let targetActionObj = req.body.parameters.find( ({key}) => key === 'targetAction' );
    let targetAction = !targetActionObj ? "index.html" : targetActionObj.value;
    console.log("*** Target action is: ", targetActionObj);
    const resbody = {
        'webview.url': externalServiceUrl + '/webviewApp/' + uuid + '/' + targetAction
    };

    utils.debugLog('Response body: ' + JSON.stringify(resbody));
    res.json(resbody);
}

module.exports = {
    "createServer": createWebviewServer,
    "setPostParamsPath": setPostParamsPath,
    "setGetWebviewPath": setGetWebviewPath,
    "setServiceUrl": setServiceUrl,
    "getServiceUrl": getServiceUrl,
    "setServicePort": setServicePort,
    "getServicePort": getServicePort
};
