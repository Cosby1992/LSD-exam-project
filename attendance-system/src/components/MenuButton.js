import React, {Component } from "react";
import '../styles/MenuButton.css';

export default class MenuButton extends Component {

    render() {
        return <div>
            <button className="menu-button" type="button" onClick={this.props.function}>{this.props.title}</button>
        </div>
    }
}