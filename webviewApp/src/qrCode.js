import React, { Component } from 'react';
import './App.css';

class QrCode extends Component {
    constructor(props) {
        super(props);
        this.goToScanBar = this.goToScanBar.bind(this);
        this.goToScanQr = this.goToScanQr.bind(this);
        this.goToGen = this.goToGen.bind(this);
    }

    render() {
        return ( 
            <div className="App-toolbar">
                <button className="App-toolbar-button"
                    onClick={this.goToScanQr}>Scan QR Code</button>

                <button className="App-toolbar-button"
                    onClick={this.goToScanBar}>Scan Bar Code</button>

                <button className="App-toolbar-button"
                    onClick={this.goToGen}>Present Pay Code</button>   
            </div>
        ); 
    }

    goToScanQr() {
        console.log("*** goToScan");
        this.props.history.push('/scanqr');
    }

    goToScanBar() {
        console.log("*** goToScan");
        this.props.history.push('/scanbar');
    }

    goToGen() {
        console.log("*** goToGen");
        this.props.history.push('/gen');
    }
}

export default QrCode;
