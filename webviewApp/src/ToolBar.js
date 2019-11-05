import React, { Component } from 'react';
import './App.css';

class ToolBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            assignee: this.props.assignee,
            inventor: this.props.inventor,
            searchText: this.props.searchText
        };
    }

    render() {
        return (
            <div className="App-toolbar">
                <div>
                    <div>
                        <span className="App-toolbar-label">Assignee: </span>
                        <input type="text" className="App-toolbar-field"
                            onChange={this.handleAssigneeChange} value={this.state.assignee}/><br/>
                        <span className="App-toolbar-label">Inventor: </span>
                        <input type="text" className="App-toolbar-field"
                            onChange={this.handleInventorChange} value={this.state.inventor}/><br/>
                        <span className="App-toolbar-label">Keyword: </span>
                        <input type="text" className="App-toolbar-field"
                            onChange={this.handleSearchTextChange} value={this.state.searchText}/>
                    </div>
                </div>
                <div>
                    <button className="App-toolbar-button"
                        onClick={this.handleScan}>Scan QR Code</button>

                    <button className="App-toolbar-button"
                        onClick={this.generateQrCode}>Generate QR Code</button>
                </div>
            </div>
        );
    }

    handleScan = () => {
        this.props.scanQrCode();
    }

    generateQrCode = () => {
        this.props.generateQrCode();
    }
}

export default ToolBar;
