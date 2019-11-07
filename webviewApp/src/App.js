import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter as Router,Route} from 'react-router-dom';

import QrCode from './qrCode';
import Scan from './scan';
import Gen from './gen'

import "core-js";
// import adapter from 'webrtc-adapter';

import './App.css';

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
    }

    render() {
        let content = "";
        if(window.TARGETACTION === 'gen') {
            content = (
                <Gen />
            );
        } else  if(window.TARGETACTION === 'scanqr'  || 
                        window.TARGETACTION === 'scanbar') {
            content = (
                <Scan />
            );
        } 

        return (
            <MuiThemeProvider>
                <div className="App">
                    <div style={{display: "block"}}>
                        <TitleBar title={"QR / Bar Code WebView"} />
                        <Router >
                            <div>
                                <Route exact path="/" component={QrCode} />                    
                                <Route path="/odaqr/webviewApp/(.*)/scan" component={Scan} /> 
                                <Route path="/odaqr/webviewApp/(.*)/gen" component={Gen} />                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                            </div>
                        </Router>
                        {content}
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
}

export default App;
