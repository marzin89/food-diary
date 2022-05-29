// Imports
import React from 'react';
// import './css/styles.css';
import SearchResults from './results/search-results';

// Sökformuläret
class Search extends React.Component {

    // Konstruktor
    constructor(props) {
        super(props);

        // Binder this till funktionerna
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        /* Lagrar livsmedel, namn, kategori, huruvida formuläret har skickats
            samt eventuella felmeddelanden */
        this.state = {
            submitted: false,
            foodName: '',
            foodCategory: '',
            foods: [],
            error: false,
            errorMessage: '',
        }
    }
    
    // Rendrering
    render() {
        return (
            <section id="search">
                {/* Formulär */}
                <form action="index.html" method="get" onSubmit={this.handleSubmit}>
                    <h2>Sök</h2>
                    <p>Här kan du söka efter livsmedel i databasen. 
                        Du kan söka på <b>namn</b> eller välja en <b>kategori</b>.
                        Du kan även välja att söka på <b>både namn och kategori</b>.
                        Observera att om du väljer att söka på enbart namn eller kategori,
                        så måste det andra fältet vara <b>tomt</b> (ingen kategori vald i 
                        dropdown-listan om du söker på namn, tomt fält för livsmedel om 
                        du söker på enbart kategori).</p>
                    {/* Livsmedel */}
                    <div>
                        <label htmlFor="food-name">Livsmedel</label>
                        <input type="text" id="food-name" autoComplete="off" onChange={this.handleNameChange}>
                        </input>
                        <select name="food-name-autofill" id="food-name-autofill"></select>
                    </div>
                    {/* Kategori */}
                    <div>
                        <label htmlFor="food-category">Kategori</label>
                        <select name="food-category" id="food-category" onChange={this.handleCategoryChange}>
                            <option label="empty" value=""></option>
                            <option value="Frukt och bär">Frukt och bär</option>
                            <option value="Grönsaker">Grönsaker</option>
                            <option value="Potatis och rotfrukter">Potatis och rotfrukter</option>
                            <option value="Bröd, flingor, gryn, pasta och ris">
                                Bröd, flingor, gryn, pasta och ris</option>
                            <option value="Kött, fisk och ägg">Kött, fisk och ägg</option>
                            <option value="Mjölk och ost">Mjölk och ost</option>
                            <option value="Matfett">Matfett</option>
                            <option value="Övrigt">Övrigt</option>
                        </select>
                    </div>
                    {/* Skicka och rensa */}
                    <input type="submit" className="submit" value="Sök"></input>
                    <input type="reset" value="Rensa" className="reset"></input>
                    {/* Här skrivs felmeddelanden i state ut */}
                    <p className="error" style={ this.state.error ? {display: 'block'} : {display: 'none'}}>
                        {this.state.errorMessage}</p>
                </form>
                {/* Här visas sökresultat när formuläret har skickats och inga felmeddelanden finns */}
                {this.state.submitted && !this.state.error ? <SearchResults foods={this.state.foods} /> : null} 
            </section>
        )
    }

    // Funktionen kontrollerar om livsmedel eller kategori har angetts
    handleSubmit(e) {

        // Förhindrar att sidan laddas om
        e.preventDefault();

        // Lagrar att formuläret har skickats
        this.setState({submitted: true});

        // Lagrar ett felmeddelande om varken livsmedel eller kategori har angetts
        if (!this.state.foodName && !this.state.foodCategory) {
            this.setState({
                error:        true,
                errorMessage: 'Du måste ange ett livsmedel eller välja en kategori.',
            })

        /* Tar bort eventuella felmeddelanden om livsmedel eller kategori har angetts
            och kör sökfunktionerna */
        } else {
            this.setState({
                error:        false,
                errorMessage: '',
            });

            this.getFoodByName();
            this.getFoodByCategory();
            this.getFoodByNameAndCategory();
        }
    }

    // Lagrar livsmedlet
    handleNameChange(e) {   
        this.setState({foodName: e.target.value});
    }

    // Lagrar kategorin
    handleCategoryChange(e) {
        this.setState({foodCategory: e.target.value});
    }

    // Funktionen körs vid sökning på enbart livsmedel
    getFoodByName() {
        if (this.state.foodName && !this.state.foodCategory) {

            // Anropar webbtjänsten
            fetch(`https://food-diary-rest-api.herokuapp.com/foods/name/${this.state.foodName}`)

            // Konverterar från JSON
            .then(response => response.json())
            .then(data => {
                // Tömmer state-arrayen och lagrar ett felmeddelande om livsmedlet inte hittades
                if(!data.length) {
                    this.setState({
                        foods:        [],
                        error:        true,
                        errorMessage: 'Det gick inte att hitta livsmedlet.',
                    });
                
                // Tar bort eventuella felmeddelanden och lagrar livsmedlet i state
                } else {
                    this.setState({
                        error:        false,
                        errorMessage: '',
                        foods:        data,
                    });
                }
            })
            .catch(() => {
                // Genererar ett felmeddelande vid serverfel
                this.setState({
                    error:        true,
                    errorMessage: 'Ett serverfel har uppstått. Det gick inte att söka.'
                        + ' Försök igen senare.'
                })
            })
        }
    }

    // Funktionen körs vid sökning på enbart kategori
    getFoodByCategory() {
        if (!this.state.foodName && this.state.foodCategory) {

            // Anropar webbtjänsten
            fetch(`https://food-diary-rest-api.herokuapp.com/foods/category/${this.state.foodCategory}`)

            // Konverterar från JSON
            .then(response => response.json())

            // Tömmer state-arrayen och lagrar ett felmeddelande om inga livsmedel hittades
            .then(data => {
                if (!data.length) {
                    this.setState({
                        foods:        [],
                        error:        true,
                        errorMessage: 'Kunde inte hitta några livsmedel.',
                    })
                
                // Tar bort eventuella felmeddelanden och lagrar livsmedel i state
                } else {
                    this.setState({
                        error:        false,
                        errorMessage: '',
                        foods:        data,
                    });
                }
            })
            .catch(() => {
                // Genererar ett felmeddelande vid serverfel
                this.setState({
                    error:        true,
                    errorMessage: 'Ett serverfel har uppstått. Det gick inte att söka.'
                        + ' Försök igen senare.'
                })
            })
        }
    }

    // Funktionen körs vid sökning på både livsmedel och kategori
    getFoodByNameAndCategory() {
        if (this.state.foodName && this.state.foodCategory) {

            // Anropar webbtjänsten
            fetch(`https://food-diary-rest-api.herokuapp.com/foods/name/${this.state.foodName}/category/${this.state.foodCategory}`)

            // Konverterar från JSON
            .then(response => response.json())

            // Tömmer state-arrayen och lagrar ett felmeddelande om inga livsmedel hittades
            .then(data => {
                if (!data.length) {
                    this.setState({
                        foods:        [],
                        error:        true,
                        errorMessage: 'Kunde inte hitta några livsmedel.',
                    });
                
                // Tar bort eventuella felmeddelanden och lagrar livsmedel i state
                } else {
                    this.setState({
                        error:        false,
                        errorMessage: '',
                        foods:        data,
                    })
                }
            })
            .catch(() => {
                // Genererar ett felmeddelande
                this.setState({
                    error:        true,
                    errorMessage: 'Ett serverfel har uppstått. Det gick inte att söka.'
                        + ' Försök igen senare.',
                })
            })
        }
    }
}

// Exporterar komponenten
export default Search;