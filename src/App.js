// Imports
import Header from './header';
import Footer from './footer';
import LoginForm from './login-form';
import SearchForm from './search-form';
import AdminForm from './admin-form';
import React from 'react';

// Main-komponenten som innehåller "sidorna"
class Main extends React.Component {
  // Konstruerare
  constructor(props) {
    super(props);
    // Binder this till funktionerna
    this.loginCallback = this.loginCallback.bind(this);
    this.logoutCallback = this.logoutCallback.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
    // Händelsehanterare
    window.addEventListener('load', this.handleLoad);
    /* Här lagras status för inloggning, inloggningsuppgifter samt 
      felmeddelanden. Vilka sektioner som visas/döljs styrs i hög
      grad härifrån. */
    this.state = {
      // loginClicked: false,
      // logoutClicked: false,
      username: '',
      password: '',
      signedIn: false,
      error: false,
      errorMessage: '',
    }
  }

  // Rendrering
  /* Första sektionen, sökformuläret och inloggninsformuläret döljs om 
    användaren är inloggad. Istället visas admin-formuläret. 
    Inloggning och utloggning sköts via callback-funktioner som skickas med
    som props. Även användarnamnet skickas med eftersom det behövs på admin-sidan. */
  render() {
    return (
      <main>
        <section>
          <h1 style={ this.state.signedIn ? {display: 'none'} : {display: 'block'}}>
            Välkommen till FooDiary</h1>
          <p style={ this.state.signedIn ? {display: 'none'} : {display: 'block'}}>
            Logga in eller för att använda kostdagboken. 
            Använd formuläret nedan för att hitta information om livsmedel.</p>
        </section>
        { this.state.signedIn ? <LoginForm handleSubmit={this.loginCallback} /> : 
          <LoginForm className="display" function={this.loginCallback} /> }
        { this.state.signedIn ? <SearchForm className="hidden" /> : <SearchForm /> } 
        { this.state.signedIn ? <AdminForm function={this.logoutCallback} 
          className="display" username={this.state.username} />
          : <AdminForm function={this.logoutCallback} />}
      </main>
    )
  }

  // Callback-funktion som sköter inloggningen
  loginCallback(username, password) {
    // Anropar webbtjänsten
    fetch('https://rocky-crag-37969.herokuapp.com/login')
      // Konverterar från JSON och loopar igenom
      .then(response => response.json())
      .then(data => data.forEach(element => {
        // Lagrar användarupgifterna om de är korrekta
        if (data.username == username && data.password == password)
        {
          /* Sessionen används för att användaren inte ska "loggas ut"
            om sidan laddas om. */
          sessionStorage.setItem('signedIn', 'true');
          this.setState({
            username: username, 
            password: password,
            signedIn: true,
          });
        // Annars lagras ett felmeddelande
        } else {
          this.setState({
            error: true,
            errorMessage: 'Fel användarnamn eller lösenord.',
          })
        }
      })
      // Lagrar eventuellt felmeddelande från webbtjänsten
      .catch(err => {
        this.setState({
          error: true,
          errorMessate: err,
        })
      })
    )
  }

  // Callback-funktion som sköter utloggningen
  logoutCallback() {
    // Ändrar sessionen
    sessionStorage.setItem('signedIn', 'false');
    // Ändrar status för inloggning
    this.setState({
      // logoutClicked: true,
      signedIn: false,
    });
  }

  /* Funktionen förhindrar att användaren "loggas in" eller "loggas ut"
    när man laddar om sidan */
  handleLoad() {
    if (sessionStorage.getItem('signedIn') == 'true') {
      this.setState({signedIn: true});
    }
  }
}

// Huvudkomponenten som rendrerar sidhuvud, innehåll och sidfot
function App() {
  return (
    <div id="page-wrapper">
      <Header />  
      <Main />
      <Footer />
    </div>
  );
}
// Exporterar komponenten
export default App;
