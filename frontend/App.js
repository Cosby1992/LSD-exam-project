const { LoginView } = window;

const root = document.getElementById('root');

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            authorized: false,
            authToken: "",
            badRequest: false,
            fetchError: false
        }

        this.login = this.login.bind(this);
    }

    async login(email, password) {
        const data = {
            email: email,
            pwd: password
        }

        try{
            const res = await fetchPost('http://localhost:3100/login', data);

            switch (res.status) {
                case 200:
                    const jsondata = await res.json();
                    console.log("res: " + jsondata);
                    console.log("header: " + res.header.authorization);

                    this.setState({
                        authorized: true,
                        authToken: res.header.authorization,
                    })
                    break;
                case 400: 
                console.log("Damn, wrong username or password");
                    this.setState({badRequest: true})
                    break;
                default:
                    break;
            }

        } catch (err) {
            console.log(err);
            console.log("PROBLEM FETCHING");
        }
        
    }
    
    render() {
        return <div className="inner-root">
                <LoginView login={this.login}></LoginView>
            </div>;
    }


}

ReactDOM.render(<App></App>, root);