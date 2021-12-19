
import React, {Component} from 'react';
import './styles/App.css';
import './styles/global.css';

import LoginView from './views/LoginView';
import TeacherView from './views/TeacherView';
import StudentView from './views/StudentView';

class App extends Component {

  constructor(props) {
      super(props);

      this.state = {
          authorized: false,
          authToken: "",
          userRole: "",
          badRequest: false,
          fetchError: false
      }

      this.login = this.login.bind(this);
      this.logout = this.logout.bind(this);
  }

  async login(email, password) {

    const data = {
      email: email,
      pwd: password
    }
      
    return await fetch('http://localhost:3100/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    }).then(async response => {

      const token = response.headers.get('Authorization');
      const body = await response.json();

      if(token) {
        this.setState({
          authorized: true,
          authToken: token,
          userRole: body.user_role
        });
      }

      return response.status;
    }).catch(err => {
      console.log(err);
    });

  }

  async logout() {
    this.setState({
      authorized: false,
      authToken: "",
      userRole: ""
    });
  }
  
  render() {

    if (this.state.authorized && this.state.userRole === 'STUDENT') {
      
      return <div className="inner-root"><StudentView logout={this.logout} authToken={this.state.authToken}></StudentView></div>

    } else if (this.state.authorized && this.state.userRole === 'TEACHER') {

      return <div className="inner-root"><TeacherView logout={this.logout} authToken={this.state.authToken}></TeacherView></div>

    } else {
      return (
        <div className="inner-root">
          <LoginView login={this.login}></LoginView>
        </div>
      );
    }

      
  }


}

export default App;
