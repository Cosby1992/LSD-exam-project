import React, { Component } from "react";


export default class LoginView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
        };

        this.setEmail = this.setEmail.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.login = this.login.bind(this);
    }

    render() {

        return <div className="login-outer-wrapper">
            <div className="login-header-wrapper">
                <h1>ATTENDANCE</h1>
            </div>
            <div className="login-inner-wrapper">

                <h1>Login</h1>
                <InputField type="email" label="Email" value={this.state.email} placeholder="john@doe.dk" onChange={this.setEmail}></InputField>
                <InputField type="password" label="Password" value={this.state.password} placeholder="••••••••••" onChange={this.setPassword}></InputField>
                
                <button type="button" onClick={this.login}>Login</button>
            
            </div>

        </div>;

    }

    async login () {
        const {email, password} = this.state;
        this.props.login(email, password);
    }

    setEmail(event) {
        this.setState({
            email: event.target.value
        })
    }

    setPassword(event) {
        this.setState({
            password: event.target.value
        })
    }

}