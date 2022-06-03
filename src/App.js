// Importerar komponenterna och React
import Header from './components/header/header';
import Footer from './components/footer/footer';
import Login from './components/login/login';
import Search from './components/search/search';
import Admin from './components/admin/admin';
import React from 'react';
import { findAllByDisplayValue } from '@testing-library/react';

// Main-komponenten som rendrerar användargränssnittet
class Main extends React.Component {

  // Konstruktor
  constructor(props) {
    super(props);

    // Binder this till funktionerna
    this.loginCallback  = this.loginCallback.bind(this);
    this.logoutCallback = this.logoutCallback.bind(this);

    /* Här lagras status för inloggning samt felmeddelanden. 
      Vilka komponenter som visas/döljs styrs i hög grad härifrån. */
    this.state = {
      username:     sessionStorage.getItem('user'),
      signedIn:     sessionStorage.getItem('signedIn'),
      error:        false,
      errorMessage: '',
    }

    // Anpassar sidans namn
    if (!this.state.signedIn) {
      document.title = 'FooDiary';
    }
  }

  // Rendrering
  /* Första sektionen och inloggninsformuläret döljs om användaren är inloggad. 
    Istället visas admin-formuläret och sökformuläret (som importeras till Admin). 
    Inloggning och utloggning sköts via callback-funktioner som skickas med som props. */
  render() {
    return (
      <main>
        <section style={ this.state.signedIn ? {display: 'none'} : {display: 'block'}} 
          className="welcome">
          <h1>Välkommen till FooDiary</h1>
          <p>Logga in eller för att använda kostdagboken. 
            Använd formuläret nedan för att hitta information om livsmedel.</p>
        </section>
        {/* Om användaren är inloggad, visas Admin. 
          Annars visas inloggningsformuläret och sökformuläret */}
        { this.state.signedIn ? <Admin function={this.logoutCallback} /> : 
          <Login function={this.loginCallback} errorMessage={this.state.errorMessage} /> }
        {/* Sökformuläret visas på ett annat ställe i koden när användaren är inloggad.
          Därför döljs det här och importeras till Admin.  */}
        {this.state.signedIn ? null : <Search />}
      </main>
    )
  }

  // Callback-funktion som sköter inloggningen
  loginCallback(username, password) {

    // Body med användarnamn och lösenord
    const body = {
      username: username,
      password: password,
    }

    // Anropar webbtjänsten
    fetch('https://food-diary-rest-api.herokuapp.com/login', {
      method:  'POST',
      headers: {'Content-Type': 'application/json',},
      body:    JSON.stringify(body), 
    })

    // Konverterar från JSON och loopar igenom
    .then(response => response.json())
    .then(data => {
      // Genererar ett felmeddelande om fel inloggningsuppgifter har angetts
      if (!data.userExists) {
        this.setState({
          error:        true,
          errorMessage: 'Fel användarnamn eller lösenord.',
        })

      } else {
        /* Sessionen används för att användaren inte ska "loggas ut" om sidan laddas om. */
        sessionStorage.setItem('signedIn', true);
        sessionStorage.setItem('user', username);

        // Lagrar inloggningen samt tar bort eventuella felmeddelanden
        this.setState({
          error:        false,
          errorMessage: '',
          username:     username, 
          signedIn:     true,
        });
      }
    })
    .catch(() => {
      // Genererar ett felmeddelande vid serverfel
      this.setState({
        error:        true,
        errorMessage: 'Ett serverfel har uppstått. Det gick inte att hämta användaruppgifter.'
          + ' Försök igen senare.',
      })
    })
  }

  // Callback-funktion som sköter utloggningen
  logoutCallback() {

    // Raderar sessionen
    sessionStorage.removeItem('signedIn');
    sessionStorage.removeItem('user');

    // Tömmer state
    this.setState({
      username: '',
      signedIn: false,
    })

    // Ändrar sidans namn
    document.title = 'FooDiary';
  }
}

/* Huvudkomponenten som rendrerar sidhuvud, innehåll och sidfot.
  Året i sidfoten (copyright) skickas med som props. */
function App() {
  return (
    <div id="page-wrapper">
      <Header />  
      <Main />
      <Footer year={new Date().getFullYear()} />
    </div>
  );
}

// Exporterar komponenten
export default App;
