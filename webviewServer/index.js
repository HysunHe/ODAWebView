"use strict";

const webviewComponent = require('./webviewComponent.js');

webviewComponent.setServiceUrl(process.env.WEBVIEW_SERVICE_URL || 'https://o100.odainfra.com/odaqr');
webviewComponent.setServicePort(process.env.WEBVIEW_SERVICE_PORT || 3001);

webviewComponent.setPostParamsPath('/webviewParams');
webviewComponent.setGetWebviewPath('/webviewApp');

const server = webviewComponent.createServer();
server.listen(webviewComponent.getServicePort());
