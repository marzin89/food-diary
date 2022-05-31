// Importerar React
import React from 'react';

// Inloggningsformuläret
class Login extends React.Component {

    // Konstruktor
    constructor(props) {
        super(props);

        // Binder this till funktionerna
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        // Lagrar inloggningsuppgifter och felmeddelanden
        this.state = {
            username:     '',
            password:     '',
            error:        false,
            errorMessage: '',
        }
    }

    // Rendrering
    render() {
        return (
            <section>
                {/* Formulär */}
                <form id="login-form" action="index.html" onSubmit={this.handleSubmit}>
                    <p>Har du inget konto? Registrera dig <a className="link" href="index.html">här</a>.</p>
                    {/* Användarnamn */}
                    <div>
                        <label htmlFor="username">Användarnamn</label>
                        <input type="text" id="username" onChange={this.handleUsernameChange}></input>
                    </div>
                    {/* Lösenord */}
                    <div>
                        <label htmlFor="password">Lösenord</label>
                        <input type="password" id="password" onChange={this.handlePasswordChange}></input>
                    </div>
                    {/* Skicka och rensa */}
                    <input type="submit" value="Logga in" className="submit"></input>
                    <input type="reset" value="Rensa" className="reset"></input>
                    {/* Här skrivs felmeddelanden i props respektive state ut */}
                    <p className="error" style={ this.state.error ? {display: 'block'} : 
                        {display: 'none'}}>{this.state.errorMessage}</p>
                    <p className="error" style={ this.props.errorMessage? {display: 'block'} :
                        {display: 'none'}}>{this.props.errorMessage}</p>
                </form>
            </section>
        )
    }

    // Lagrar användarnamnet
    handleUsernameChange(e) {
        this.setState({username: e.target.value});
    }

    // Lagrar lösenordet
    handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }

    /* Funktion som kör callback-funktionen i props vid inloggning.
        Funktionen kontrollerar endast att båda fält är ifyllda.
        Anropet till webbtjänsten sker i callback-funktionen. */
    handleSubmit(e) {

        // Förhindrar att sidan laddas om
        e.preventDefault();

        // Tar bort eventuella felmeddelanden om användarnamn och lösenord har angetts
        if (this.state.username && this.state.password) {
            // Kör callback-funktionen i props
            this.props.function(this.state.username, this.state.password);
        
        // Genererar ett felmeddelande om något fält är tomt
        } else {
            this.setState({
                error:        true,
                errorMessage: 'Du måste ange ditt användarnamn och lösenord.',
            });
        }
    }
}

// Exporterar komponenten
export default Login;