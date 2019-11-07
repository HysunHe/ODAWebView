import React, { Component } from 'react';
import { BrowserQRCodeSvgWriter } from '@zxing/library';
import { postback } from './RestUtil';
import './App.css';

class Gen extends Component {
    constructor(props) {
        super(props);
         this.completedPay = this.completedPay.bind(this);
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
                <button className="normal-button" onClick={this.completedPay}>Completed the pay</button>  
            </div>
        );
    }

    completedPay() {
         let payload = {result: "ok"};
         postback(payload, null, null);
         setTimeout(() => {
             window.top.close(); 
         }, 1000);
     }
}

export default Gen;