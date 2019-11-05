import React, { Component } from 'react';

import './App.css';

class QrCode extends Component {
    render() {
        return (
            <div className="QrCode-Scan-Region">
                <div>
                    <video id="video" className="QrCode-Square" width="300" height="200"></video>
                </div>

                <div className="QrCode-Square" id="result" style={{marginTop:"20px"}} >    
                </div>
            </div>
        );
    }
}

export default QrCode;