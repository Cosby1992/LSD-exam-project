import React, { Component } from "react";
import '../styles/InputField.css';

export default class InputField extends Component {

    render() {
        return <div className="input-wrapper">
            <label className="input-label">{this.props.label}</label>
            <input className="inputfield" type={this.props.type} value={this.props.value} placeholder={this.props.placeholder} onChange={ this.props.onChange } required></input>
        </div>
    }

}