import React, { Component } from "react";
import InputField from "../components/InputField";
import '../styles/LoginView.css';


export default class LoginView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            error: false,
            missingEmailOrPassword: false,
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

                {this.state.missingEmailOrPassword ? <h4>Wrong username or email</h4> : null}
                {this.state.error ? <h4>An unknown error occured</h4> : null}
                
                <button type="button" onClick={this.login}>Login</button>
            
            </div>

        </div>;

    }

    async login () {
        const {email, password} = this.state;
        const status =  await this.props.login(email, password);
        if(status === 400) {
            this.setState({
                missingEmailOrPassword: true,
            });
        } else if (status !== 200) {
            this.setState({
                error: true
            })
        }
    }

    setEmail(event) {
        this.setState({
            email: event.target.value,
            missingEmailOrPassword: false,
            error: false
        })
    }

    setPassword(event) {
        this.setState({
            password: event.target.value,
            missingEmailOrPassword: false,
            error: false
        })
    }

}