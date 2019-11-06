import React, { Component } from 'react';
import { BrowserQRCodeReader } from '@zxing/library';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import { postback } from './RestUtil';
import './App.css';

class Scan extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            showAmt:  false,
            showScan:  true,
            loadingState: "hide",
            amount: 100
         };
         this.confirmPay = this.confirmPay.bind(this);
    }

    componentWillMount() {
        console.log("*** Scan componentWillMount");
    }

    async componentDidMount() {
        this.toggleSpinner("loading");
        console.log("*** Scan componentDidMount");
        console.log("*** Scanning QR code");
        const codeReader = new BrowserQRCodeReader();
        let devices = await codeReader.getVideoInputDevices();
        console.log("*** devices: ", devices);
        let device = devices[0].deviceId;
        console.log("*** Use device: " + device);
        this.toggleSpinner("hide");
        codeReader.decodeFromInputVideoDevice(device, 'video')
            .then((result) => {
                console.log("Decode result: ", result);
                this.confirmPay(result);
                 // this.inputAmt.focus();
          }).catch((err) => {
                console.error("Decode error:", err);
          })
    }

    toggleSpinner = (loading) => {
        this.setState(() => {
            return {
                loadingState: loading
            };
        });
    }

    render() {
        let amtSection = "";
        if(this.state.showAmt) {
            amtSection = (
            <div style={{fontSize: "1.25rem"}}>
                <label htmlFor="amount">Enter Your Amount: </label>
                <input type="number" ref={(input) => this.inputAmt = input}  value={this.state.amount}
                    style={{ width: "100%", marginTop: "20px", lineHeight: 2, fontSize: "20px" }}
                    onChange={this.handleAmountChange}></input>
                <button className="normal-button" onClick={this.confirmPay}>Confirm to Pay</button>  
            </div> 
            )
        } 

        let scanSection = "";
        if(this.state.showScan) {
            scanSection = (
                <div>
                    <video id="video" className="QrCode-Square" width="300" height="200"></video>
                </div>
            )
        }

        let payDoneSection = "";
        if(this.state.payDone) {
            payDoneSection = (
                <div>
                    Scan successfully. Please return to the ChatBot and continue the conversation.
                </div>
            )
        }

        return (
            <div className="QrCode-Scan-Region">
                <RefreshIndicator size={60} 
                        status={this.state.loadingState} top={50} left={50}
                        style={{position:"absolute", top:"50%", left:"50%", 
                        transform:"translateX(-50%) translateY(-50%)"}} />
                {scanSection}
                {amtSection}
                {payDoneSection}
            </div>
        );
    }

    handleAmountChange = (event) => {
        this.setState({
            amount: event.target.value
        });
    }

    async  confirmPay(result) {
       this.toggleSpinner("loading");
        let payload = {result: result.text};
        await postback(payload, null, null);
        this.toggleSpinner("hide");
        this.setState({ 
            showAmt:  false,
            showScan:  false,
            payDone: true
         });
        setTimeout(() => {
            window.top.close(); 
        }, 3000);
    }
}

export default Scan;