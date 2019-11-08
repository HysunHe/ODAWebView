import React, { Component } from 'react';
import { BrowserQRCodeSvgWriter } from '@zxing/library';
import { postback } from './RestUtil';
import './App.css';

class Gen extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            payDone: false
         };
         this.completedPay = this.completedPay.bind(this);
    }

    componentWillMount() {
        console.log("*** Scan componentWillMount");
    }

    async componentDidMount() {  
        const codeWriter = new BrowserQRCodeSvgWriter();
        const input = {
            "customerid": "customer128934",
            "customername": "Spider Man",
            "datetime": (new Date()).getTime()
        }
        codeWriter.writeToDom('#result', input, 300, 300);
        console.log("*** Generating QR code...[Done]");
    }

    render() {
        let codeSection = "",  payDoneSection = "";
        if(this.state.payDone) {
            payDoneSection = (
                <div>
                    Success. Please return to the ChatBot and continue the conversation.
                </div>
            );
        } else {
            codeSection = (
                <div className="QrCode-Scan-Region">
                    <div className="QrCode-Square" id="result" style={{marginTop:"20px"}} > 
                    </div>
                    <button className="normal-button" onClick={this.completedPay}>Completed the pay</button>  
                </div>
            );
        }

        return (
            <div className="QrCode-Scan-Region">
                {codeSection}
                {payDoneSection}
            </div>
        );
    }

    completedPay() {
         let payload = {result: "ok"};
         postback(payload, null, null);
         this.setState({ 
            payDone: true
         });
         setTimeout(() => {
             window.top.close(); 
         }, 1000);
     }
}

export default Gen;