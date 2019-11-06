import React, { Component } from 'react';
import { BrowserQRCodeSvgWriter } from '@zxing/library';
import './App.css';

class Gen extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("*** Scan componentWillMount");
    }

    async componentDidMount() {
        const codeWriter = new BrowserQRCodeSvgWriter();
        codeWriter.writeToDom('#result', 'http://www.baidu.com', 300, 300);
        console.log("*** Generating QR code...[Done]");
    }

    render() {
        return (
            <div className="QrCode-Scan-Region">
                <div className="QrCode-Square" id="result" style={{marginTop:"20px"}} > 
                </div>
            </div>
        );
    }
}

export default Gen;