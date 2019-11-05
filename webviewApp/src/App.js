import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import ToolBar from './ToolBar';
import QrCode from './QrCode';
import { BrowserQRCodeReader, BrowserQRCodeSvgWriter } from '@zxing/library';

import './App.css';

import "core-js";
// import adapter from 'webrtc-adapter';

import VConsole from 'vconsole';
window.vConsole = new VConsole();

class TitleBar extends Component {
    render() {
        return (
            <div className="App-header">
                <div className="App-title">{this.props.title}</div>
            </div>
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            assignee: (window.ASSIGNEE === "__ASSIGNEE_PLACEHOLDER__" ? "Oracle" : window.ASSIGNEE),
            inventor: (window.INVENTOR === "__INVENTOR_PLACEHOLDER__" ? "James" : window.INVENTOR),
            searchText: (window.KEYWORD === "__KEYWORD_PLACEHOLDER__" ? "systems" : window.KEYWORD),
        };
    }

    render() {
        return (
            <MuiThemeProvider>
                <div className="App">
                    <RefreshIndicator size={60} status={this.state.loadingState}
                        top={50} left={50}
                        style={{position:"absolute", top:"50%", left:"50%",
                                transform:"translateX(-50%) translateY(-50%)"}} />

                    <div style={{display: "block"}}>
                        <TitleBar title={"QR Code"} />

                        <ToolBar  scanQrCode = {this.scanQrCode} 
                            generateQrCode = {this.generateQrCode} 
                        />

                        <QrCode />

                    </div>
                </div>
            </MuiThemeProvider>
        );
    }

    componentWillMount() {
        console.log("*** componentWillMount");
    }

    componentDidMount() {
        console.log("*** componentDidMount");
    }

    scanQrCode = async () => {
        console.log("*** Scanning QR code");
        const codeReader = new BrowserQRCodeReader();
        let devices = await codeReader.getVideoInputDevices();
        console.log("*** devices: ", devices);
        let device = devices[0].deviceId;
        console.log("*** Use device: " + device);
        codeReader.decodeFromInputVideoDevice(device, 'video')
            .then((result) => {
                console.log("Decode result: ", result);
          }).catch((err) => {
                console.error("Decode error:", err);
          })
    }

    generateQrCode = async () => {
        console.log("*** Generating QR code ");
        const codeWriter = new BrowserQRCodeSvgWriter();
        codeWriter.writeToDom('#result', 'http://www.baidu.com', 300, 300);
        console.log("*** Generating QR code...[Done]");
    }
}

export default App;
