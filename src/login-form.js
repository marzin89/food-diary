// Imports
import React from 'react';
import './css/styles.css';

// Inloggningsformuläret
class LoginForm extends React.Component {
    // Konstruerare
    constructor(props) {
        super(props);
        /*this.usernameInput = React.createRef();
        this.passwordInput = React.createRef();
        this.error = React.createRef();*/
        // Binder this till funktionerna
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        // Lagrar inloggningsuppgifter och felmeddelanden
        this.state = {
            username: '',
            password: '',
            error: false,
            errorMessage: '',
        }
    }

    /* Formuläret visas eller döljs baserat på det klassnamn som skickats med i
        main-komponenten. */
    render() {
        return (
            <div className={this.props.className} style={
                    this.props.className == 'hidden' ? {display: 'none'} : {display: 'block'}
                }>
                <form action="index.html" onSubmit={this.handleSubmit}>
                    <p>Har du inget konto? Registrera dig <a href="index.html">här</a>.</p>
                    <div>
                        <label htmlFor="username">Användarnamn</label>
                        <input type="text" id="username" onChange={this.handleUsernameChange}
                            ref={this.usernameInput}></input>
                        <p id="username-error" className="error"></p>
                    </div>
                    <div>
                        <label htmlFor="password">Lösenord</label>
                        <input type="password" id="password" onChange={this.handlePasswordChange}
                            ref={this.passwordInput}></input>
                        <p id="password-error" className="error"></p>
                    </div>
                    <input type="submit" value="Logga in" id="submit"></input>
                    <input type="reset" value="Rensa" id="reset"></input>
                    <p className="error" style={ this.state.error ? {display: 'block'} : 
                        {display: 'none'}}>{this.state.errorMessage}</p>
                </form>
            </div>
        )
    }

    handleUsernameChange(e) {
        this.setState({username: e.target.value});
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.username && this.state.password) {
            this.props.function(this.state.username, this.state.password);
        } else {
            this.setState({
                error: true,
                errorMessage: 'Du måste ange ditt användarnamn och lösenord.',
            });
        }
    }
}

LoginForm.defaultProps = {
    className: 'hidden',
}

// Exporterar komponenten
export default LoginForm;