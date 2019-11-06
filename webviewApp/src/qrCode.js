import React, { Component } from 'react';
import './App.css';

class QrCode extends Component {
    constructor(props) {
        super(props);
        this.goToScan = this.goToScan.bind(this);
        this.goToGen = this.goToGen.bind(this);
    }

    render() {
        return ( 
            <div className="App-toolbar">
                <button className="App-toolbar-button"
                    onClick={this.goToScan}>Scan QR Code</button>

                <button className="App-toolbar-button"
                    onClick={this.goToGen}>Generate QR Code</button>   
            </div>
        ); 
    }

    goToScan() {
        console.log("*** goToScan");
        this.props.history.push('/odaqr/webviewApp/goto/scan');
    }

    goToGen() {
        console.log("*** goToGen");
        this.props.history.push('/odaqr/webviewApp/goto/gen');
    }
}

export default QrCode;
