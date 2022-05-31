// Importerar, React, sökformuläret och CSS
import React from 'react';
import { useState } from 'react/cjs/react.production.min';
// import './css/styles.css';
import Search from '../search/search';

// Här lagras ingredienser och näringsvärden
let ingredients        = [];
let updatedIngredients = [];
let totalCalories      = 0;
let totalProtein       = 0;
let totalCarbohydrates = 0;
let totalFats          = 0;
let totalSalt          = 0;
let totalWater         = 0;
let totalAsh           = 0;

/* Denna variabel används för att hitta index i ingredients-arrayen vid redigering.
    Arrayen används då för att lagra de ingredienser som ingår i måltiden som ska redigeras.
    Inmatningsfälten fylls i med de värden som finns i denna array. */
let count = 0;

// Inmatningsfält för måltider
const inputs = document.getElementsByClassName('meal-input');

// Admin-formuläret
class Admin extends React.Component {

    // Konstruktor
    constructor(props) {
        super(props);

        // Binder this till funktionerna
        this.handleActionChange        = this.handleActionChange.bind(this);
        this.handleNameChange          = this.handleNameChange.bind(this);
        this.handleFoodChange          = this.handleFoodChange.bind(this);
        this.handleCategoryChange      = this.handleCategoryChange.bind(this);
        this.handleQuantityChange      = this.handleQuantityChange.bind(this);
        this.handleCaloriesChange      = this.handleCaloriesChange.bind(this);
        this.handleProteinChange       = this.handleProteinChange.bind(this);
        this.handleCarbohydratesChange = this.handleCarbohydratesChange.bind(this);
        this.handleFatsChange          = this.handleFatsChange.bind(this);
        this.handleSaltChange          = this.handleSaltChange.bind(this);
        this.handleWaterChange         = this.handleWaterChange.bind(this);
        this.handleAshChange           = this.handleAshChange.bind(this);
        this.handleDateRangeChange     = this.handleDateRangeChange.bind(this);
        this.addFood                   = this.addFood.bind(this);
        this.getMeals                  = this.getMeals.bind(this);
        this.getAllMeals               = this.getAllMeals.bind(this);
        this.getMealsByDateRange       = this.getMealsByDateRange.bind(this);
        this.addMeal                   = this.addMeal.bind(this);
        this.editMeal                  = this.editMeal.bind(this);
        this.updateMeal                = this.updateMeal.bind(this);
        this.deleteMeal                = this.deleteMeal.bind(this);
        this.handleLogout              = this.handleLogout.bind(this);
        this.setState                  = this.setState.bind(this);

        this.state = {
            /* Dessa properties används främst för att styra gränssnittets 
            utseende beroende på vad som ska göras */
            addMeals:         true,
            getAllMeals:      true,
            getSelectedMeals: false,
            editMeals:        false,
            deleteMeals:      false,
            // Tidsintervall vid filtrering av måltider
            dateRange:        '',
            // Måltider
            meals:            [],
            // Namn, livsmedel, kategori, mängd, näringstäthet och näringsvärde
            mealName:         sessionStorage.getItem('name'),
            food:             '',
            category:         '',
            quantity:         '',
            calories:         '',
            protein:          '',
            carbohydrates:    '',
            fats:             '',
            salt:             '',
            water:            '',
            ash:              '',
            // Måltid
            meal: {
                username:           sessionStorage.getItem('user'),
                mealName:           '',
                mealID:             '',
                meal:               [],
                totalCalories:      '',
                totalProtein:       '',
                totalCarbohydrates: '',
                totalFats:          '',
                totalSalt:          '',
                totalWater:         '',
                totalAsh:           '',
                date:               ''
            },
            // Fel- och bekräftelsemeddelanden (skrivs ut om true)
            error:                 false,
            errorMessage:          '',
            errorMessageDateRange: '',
            confirm:               false,
            confirmMessage:        '',
        }

        // Ändrar sidans namn
        document.title = 'Admin';

        this.getAllMeals();
    }

    // Rendrering (visas om användaren är inloggad)
    render() {
        return (
            <div>
                <section className="welcome">
                    <h1>Välkommen till kostdagboken!</h1>
                    <p id="logout"><a id="logout-link" className="link" href="index.html" 
                        onClick={this.handleLogout}>Logga ut</a></p>
                    <p>Här kan du lägga till, radera och läsa ut måltider.
                        Använd formuläret nedan för att lägga till måltider.
                        Du lägger till en ingrediens i taget. 
                        Näringstäthet och näringsämnen anges <b>per 100 g</b>.
                        Du kan använda sökfunktionen ovan för att få fram dessa uppgifter.
                        Tryck på <b>Lägg till ingrediens</b> för att spara ingrediensen.
                        Tryck på <b>Lägg till måltid</b> för att spara måltiden när du
                        har lagt till alla ingredienser.
                    </p>
                </section>
                {/* Sökformuläret */}
                <Search />
                {/* Formulär för att lägga till måltider. Alla näringsvärden läggs till per 100 gram
                    och beräknas sedan baserat på den angivna mängden. Varje fält har en handler-funktion
                    som lagrar värdet i state vid inmatning. */}
                <form id="admin-form">
                    <h2>{this.state.addMeals ? 'Lägg till måltider' : 'Redigera måltider'}</h2>
                    <div id="add-meals">
                        {/* Måltidens namn */}
                        <label htmlFor="meal-name">Namn på måltiden *</label>
                        <input type="text" id="meal-name" className="meal-input"  
                            onBlur={this.handleNameChange}></input>
                        {/* Ingredienser */}
                        <div id="ingredient-list">
                            {/* Ingrediensens namn */}
                            <label htmlFor='food'>Lägg till en ingrediens *</label>
                            <input type="text" id="food" className="meal-input" placeholder="Namn *"
                                onBlur={this.handleFoodChange}></input>
                            {/* Livsmedelskategori */}
                            <label htmlFor='category'>Välj kategori *</label>
                            <select name="category" id="category" className='meal-input'
                                onBlur={this.handleCategoryChange}>
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
                            {/* Mängd i gram */}
                            <label htmlFor='quantity'>Mängd *</label>
                            <input type="text" id="quantity" className="meal-input" placeholder="g"
                                onBlur={this.handleQuantityChange}></input>
                            {/* Kalorier */}
                            <label htmlFor='calories'>Näringstäthet *</label>
                            <input type="text" id="calories" className="meal-input" placeholder="kcal"
                                onBlur={this.handleCaloriesChange}></input>
                            {/* Protein i gram */}
                            <label htmlFor='protein'>Protein *</label>
                            <input type="text" id="protein" className="meal-input" placeholder="g"
                                onBlur={this.handleProteinChange}></input>
                            {/* Kolhydrater i gram */}
                            <label htmlFor='carbohydrates'>Kolhydrater *</label>
                            <input type="text" id="carbohydrates" className="meal-input" placeholder="g"
                                onBlur={this.handleCarbohydratesChange}></input>
                            {/* Fett i gram */}
                            <label htmlFor='fats'>Fett *</label>
                            <input type="text" id="fats" className="meal-input" placeholder="g"
                                onBlur={this.handleFatsChange}></input>
                            {/* Salt i gram */}
                            <label>Salt *</label>
                            <input type="text" id="salt" className="meal-input" placeholder="g"
                                onBlur={this.handleSaltChange}></input>
                            {/* Vatten i gram */}
                            <label htmlFor='water'>Vatten *</label>
                            <input type="text" id="water" className="meal-input" placeholder="g"
                                onBlur={this.handleWaterChange}></input>
                            {/* Vatten i aska */}
                            <label>Aska *</label>
                            <input type="text" id="ash" className="meal-input" placeholder="g"
                                onBlur={this.handleAshChange}></input>
                        </div>
                        {/* Lägger till ingrediensen */}
                        {this.state.editMeals ? <input className="submit" type="submit" 
                            value="Uppdatera ingrediens" onClick={this.editMeal}></input> :
                            <input className="submit" type="submit" value="Lägg till ingrediens" 
                            onClick={this.addFood}></input>}
                        {/* Lägger till måltiden */}
                        {this.state.editMeals ? <input className="submit" type="submit" 
                            value="Uppdatera måltid" onClick={this.updateMeal}></input> :
                            <input className="submit-meal" type="submit" value="Lägg till måltid" 
                            onClick={this.addMeal}></input>}
                        <input type="reset" value="Rensa" id="reset" className="reset"></input>
                    </div>
                    {/* Skriver ut eventuella felmeddelanden */}
                    <p className="error" style={this.state.error ? {display: 'block'} : {display: 'none'}}>
                        {this.state.errorMessage}</p>
                    {/* Skriver ut eventuella bekräftelsemeddelanden */}
                    <p className="confirm" style={this.state.confirm ? {display: 'block'} : {display: 'none'}}>
                        {this.state.confirmMessage}</p>
                </form>
                {/* Sektion för utskrift och filtrering. Alla måltider visas som standard */}
                <section id="meal-section">
                    <h2>Dina måltider</h2>
                    <h3>Filtrera</h3>
                    {/* Här filtrerar användaren måltider (alla eller tidsperiod) */}
                    <div id="get-meals">
                        <div id="get-all-meals">
                            <input type="radio" name="get-meals-options" id="get-all-meals-radio" value="Alla måltider"
                                className="admin-form-radio-left" onChange={this.handleActionChange}></input>
                            <label htmlFor="get-all-meals-radio" className="admin-form-radio-right">Alla måltider</label>
                        </div>
                        <div id="get-meals-date-range">
                            <input type="radio" name="get-meals-options" id="get-meals-date-range-radio" value="Begränsad tidsperiod"
                                className="admin-form-radio-left" onChange={this.handleActionChange}></input>
                            <label htmlFor="get-meals-date-range-radio" className="admin-form-radio-right">Begränsad tidsperiod
                            </label>
                        </div>
                        <select id="date-range" onChange={this.handleDateRangeChange}>
                            <option value="">-</option>
                            <option value="Senaste veckan">Senaste veckan</option>
                            <option value="Senaste månaden">Senaste månaden</option>
                            <option value="Senaste tre månaderna">Senaste tre månaderna</option>
                            <option value="Senaste halvåret">Senaste halvåret</option>
                            <option value="Senaste året">Senaste året</option>
                        </select>
                    </div>
                    {/* Hämtar måltider */}
                    <button id="get-meals-submit" onClick={this.getMeals}>Filtrera</button>
                    {/* Skriver ut eventuella felmeddelanden */}
                    <p className="error" style={this.state.error ? {display: 'block'} : {display: 'none'}}>
                        {this.state.errorMessageDateRange}</p>
                    {/* Loopar igenom state-arrayen och skriver ut användarens måltider */}
                    {this.state.meals ? this.state.meals.map(element => {
                        return (
                            // Denna sektion visas endast om det finns måltider att visa
                            <div className="meals" style={this.state.meals.length > 0 ? {display: 'block'} : 
                                {display: 'none'}}>
                                {/* Måltidens namn */}
                                <h3 key={element.mealID}>{element.mealName}</h3>
                                {/* Måltidens datum skrivs ut utan tid (tidsstämpel i databasen) */}
                                <div className="row">
                                    <p className="date-heading meal-heading">Datum</p>
                                    <p className="date meal-detail">{element.date ? element.date.slice(0, 10) 
                                        : null}</p>
                                </div>
                                {/* Loopar igenom arrayen med ingredienser och skriver ut namn och mängd */}
                                {element.meal.map(food => {
                                    return (
                                        <table key={food.id}>
                                            <tr>
                                                <td className="meal-heading">Ingrediens</td>
                                                <td className="meal-detail">{food.food}</td>
                                            </tr>
                                            <tr>
                                                <td className="meal-heading">Mängd</td>
                                                <td className="meal-detail">{food.quantity} g</td>
                                            </tr>
                                        </table>
                                    )
                                })}
                                {/* Näringstäthet och -värde för måltiden */}
                                <table>
                                    <tr>
                                        <td className="meal-heading">Kalorier</td>
                                        <td className="meal-detail">{element.totalCalories} kcal</td>
                                    </tr>
                                    <tr>
                                        <td className="meal-heading">Protein</td>
                                        <td className="meal-detail">{element.totalProtein} g</td>
                                    </tr>
                                    <tr>
                                        <td className="meal-heading">Kolhydrater</td>
                                        <td className="meal-detail">{element.totalCarbohydrates} g</td>
                                    </tr>
                                    <tr>
                                        <td className="meal-heading">Fett</td>
                                        <td className="meal-detail">{element.totalFats} g</td>
                                    </tr>
                                    <tr>
                                        <td className="meal-heading">Salt</td>
                                        <td className="meal-detail">{element.totalSalt} g</td>
                                    </tr>
                                    <tr>
                                        <td className="meal-heading">Vatten</td>
                                        <td className="meal-detail">{element.totalWater} g</td>
                                    </tr>
                                    <tr>
                                        <td className="meal-heading">Aska</td>
                                        <td className="meal-detail">{element.totalAsh} g</td>
                                    </tr>
                                    {/* Länkar för redigering och borttagning */}
                                    <tr>
                                        <td className="meal-heading"><a id={`edit${element.mealID}`} 
                                            href="#admin-form" className="link" onClick={this.editMeal}>Redigera</a></td>
                                        <td className="meal-detail"><a id={`delete${element.mealID}`} 
                                            href="" className="link" onClick={this.deleteMeal}>Radera</a></td>
                                    </tr>
                                </table>
                            </div>
                            )
                        })
                    : null}  
                </section>
            </div>
        )
    }

    /* Handler-funktionerna nedan lagrar värdet i inmatningsfälten i state */
    handleActionChange(e) {
        if (e.target.value == 'Alla måltider') {
            this.setState({
                getAllMeals:      true,
                getSelectedMeals: false,
            })
        
        } else if (e.target.value == 'Begränsad tidsperiod') {
            this.setState({
                getAllMeals:      false,
                getSelectedMeals: true,
            })
        }
    }

    handleNameChange(e) {
        sessionStorage.setItem('name', e.target.value);

        this.setState({
            mealName: e.target.value,
        })
    }

    handleFoodChange(e) {
        this.setState({
            food: e.target.value,
        })
    }

    handleCategoryChange(e) {
        this.setState({
            category: e.target.value,
        })
    }

    handleQuantityChange(e) {
        this.setState({
            quantity: e.target.value,
        })
    }

    handleCaloriesChange(e) {
        this.setState({
            calories: e.target.value,
        })
    }

    handleProteinChange(e) {
        this.setState({
            protein: e.target.value,
        })
    }

    handleCarbohydratesChange(e) {
        this.setState({
            carbohydrates: e.target.value,
        })
    }

    handleFatsChange(e) {
        this.setState({
            fats: e.target.value,
        })
    }

    handleSaltChange(e) {
        this.setState({
            salt: e.target.value,
        })
    }

    handleWaterChange(e) {
        this.setState({
            water: e.target.value,
        })
    }

    handleAshChange(e) {
        this.setState({
            ash: e.target.value,
        })
    }

    handleDateRangeChange(e) {
        this.setState({
            dateRange: e.target.value,
        })
    }

    // Funktion som sköter utloggningen
    handleLogout(e) {
        // Förhindrar att sidan laddas om när formuläret skickas
        e.preventDefault();

        // Anropar callback-funktionen i props
        this.props.function();
    }

    // Hämtar alla användarens måltider
    getAllMeals() {
        // GET-anrop
        fetch(`https://food-diary-rest-api.herokuapp.com/meals/user/${sessionStorage.getItem('user')}`)
        // Konverterar svaret från JSON
        .then(response => response.json())
        .then(data => {
            if (!data.length) {
                // Lagrar ett felmeddelande om inga måltider hittades
                this.setState({
                    error:        true,
                    errorMessage: 'Kunde inte hitta några måltider.',
                })
            // Tar bort eventuella felmeddelanden och lagrar måltider i state
            } else {
                this.setState({
                    error:        false,
                    errorMessage: '',
                    meals:        data,
                });
            }
        })
        .catch(() => {
            // Genererar ett felmeddelande vid serverfel
            this.setState({
                error:        true,
                errorMessage: 'Ett serverfel har uppstått. Det gick inte att hämta måltider.' 
                    + ' Försök igen senare.'
            })
        })
    }
    // Hämtar användarens måltider för vald tidsperiod
    getMealsByDateRange() {
        // GET-anrop
        fetch(`https://food-diary-rest-api.herokuapp.com/meals/user/${sessionStorage.getItem('user')}/range/${this.state.dateRange}`)
        // Konverterar svaret från JSON
        .then(response => response.json()
        .then(data => {
            if (!data.length) {
                // Tömmer state-arrayen och lagrar ett felmeddelande om inga måltider hittades
                this.setState({
                    error:        true,
                    errorMessage: 'Kunde inte hitta några måltider.',
                })
            // Tar bort eventuella felmeddelanden och lagrar måltiderna i state
            } else {
                this.setState({
                    error:        false,
                    errorMessage: '',
                    meals:        data,
                });
            }
        }))
        .catch(() => {
            // Genererar ett felmeddelande vid serverfel
            this.setState({
                error:        true,
                errorMessage: 'Ett serverfel har uppstått. Det gick inte att hämta måltider.' 
                                + ' Försök igen senare.'
            })
        })
    }
    // Funktionen körs när formuläret skickas och när sidan laddas om
    getMeals(e) {
        // Förhindrar att sidan laddas om
        e.preventDefault();
        /* Beroende på vad som finns lagras i state så hämtas alla måltider,
            eller måltider för vald tidsperiod. Om användaren har valt att
            filtrera på datum, men inte angett någon tidsperiod, skrivs ett
            felmeddelande ut. */
        if (this.state.getAllMeals) {
            sessionStorage.removeItem('error');

            this.setState({
                error:                 false,
                errorMessageDateRange: '',
            })

            this.getAllMeals();
        
        } else if (this.state.getSelectedMeals && this.state.dateRange !== '' &&
            this.state.dateRange !== '-') {
            sessionStorage.removeItem('error');

            this.setState({
                error:                 false,
                errorMessageDateRange: '',
            })

            this.getMealsByDateRange();
        
        } else if (this.state.getSelectedMeals && !this.state.dateRange || 
            this.state.dateRange == '-') {
            sessionStorage.setItem('error', true);

            this.setState({
                error:                 true,
                errorMessageDateRange: 'Du måste välja en tidsperiod.',
            })
        }
    }

    // Lägger till en ingrediens
    addFood(e) {
        // Förhindrar att sidan laddas om när formuläret skickas
        e.preventDefault();

        // Här lagras ingrediensen
        let ingredient = {
            food:          '',
            category:      '',
            quantity:      '',
            calories:      '',
            protein:       '',
            carbohydrates: '',
            fats:          '',
            salt:          '',
            water:         '',
            ash:           ''
        };

        // Kontrollerar om alla inmatningsfält är ifyllda
        for (let i = 0; i < inputs.length; i++) {
            // Skriver ut ett felmeddelande om ett inmatningsfält är tomt
            if (inputs[i].value == '') {
                sessionStorage.setItem('error', true);
                
                this.setState({
                    error:        true,
                    errorMessage: 'Alla fält är obligatoriska.',
                });

            // Tar bort eventuella felmeddelanden om alla inmatningsfält är ifyllda
            } else {
                sessionStorage.removeItem('error');

                this.setState({
                    error:        false,
                    errorMessage: '',
                })
            }
        }

        if (!sessionStorage.getItem('error')) {
            /* Lagrar måltidens namn i state och ingrediensen i objektet.
                Eventuella kommatecken byts ut mot punkt. */
            this.setState({
                mealName: inputs[0].value, 
            })

            ingredient.food          = inputs[1].value;
            ingredient.category      = inputs[2].value;
            
            if (inputs[3].value.indexOf(',') != -1) {
                ingredient.quantity = inputs[3].value.replace(',', '.');
            } else {
                ingredient.quantity = inputs[3].value;
            }

            if (inputs[4].value.indexOf(',') != -1) {
                ingredient.calories = inputs[4].value.replace(',', '.');
            } else {
                ingredient.calories = inputs[4].value;
            }

            if (inputs[5].value.indexOf(',') != -1) {
                ingredient.protein = inputs[5].value.replace(',', '.');
            } else {
                ingredient.protein = inputs[5].value;
            }

            if (inputs[6].value.indexOf(',') != -1) {
                ingredient.carbohydrates = inputs[6].value.replace(',', '.');
            } else {
                ingredient.carbohydrates = inputs[6].value;
            }

            if (inputs[7].value.indexOf(',') != -1) {
                ingredient.fats = inputs[7].value.replace(',', '.');
            } else {
                ingredient.fats = inputs[7].value;
            }

            if (inputs[8].value.indexOf(',') != -1) {
                ingredient.salt = inputs[8].value.replace(',', '.');
            } else {
                ingredient.salt = inputs[8].value;
            }

            if (inputs[9].value.indexOf(',') != -1) {
                ingredient.water = inputs[9].value.replace(',', '.');
            } else {
                ingredient.water = inputs[9].value;
            }

            if (inputs[10].value.indexOf(',') != -1) {
                ingredient.ash = inputs[10].value.replace(',', '.');
            } else {
                ingredient.ash = inputs[10].value;
            }

            /* Här räknas näringstäthet och -värde ut för ingrediensen och måltiden totalt.
                Eftersom användaren anger dessa värden per 100 gram, måste procentandelen
                för den angivna mängden räknas ut. Värdena görs om till flyttal och multipliceras 
                med procentandelen. */ 
            let percentage = ingredient.quantity / 100;

            totalCalories            += (parseFloat(ingredient.calories) * percentage);
            ingredient.calories      =  (parseFloat(ingredient.calories) * percentage);
            totalProtein             += (parseFloat(ingredient.protein) * percentage);
            ingredient.protein       =  (parseFloat(ingredient.protein) * percentage);
            totalCarbohydrates       += (parseFloat(ingredient.carbohydrates) * percentage);
            ingredient.carbohydrates =  (parseFloat(ingredient.carbohydrates) * percentage);
            totalFats                += (parseFloat(ingredient.fats) * percentage);
            ingredient.fats          =  (parseFloat(ingredient.fats) * percentage);
            totalSalt                += (parseFloat(ingredient.salt) * percentage);
            ingredient.salt          =  (parseFloat(ingredient.salt) * percentage);
            totalWater               += (parseFloat(ingredient.water) * percentage);
            ingredient.water         =  (parseFloat(ingredient.water) * percentage);
            totalAsh                 += (parseFloat(ingredient.ash) * percentage);
            ingredient.ash           =  (parseFloat(ingredient.ash) * percentage);

            // Avrundar näringsvärdena till en decimal
            ingredient.protein       = ingredient.protein.toFixed(2);
            ingredient.carbohydrates = ingredient.carbohydrates.toFixed(2);
            ingredient.fats          = ingredient.fats.toFixed(2);
            ingredient.salt          = ingredient.salt.toFixed(2);
            ingredient.water         = ingredient.water.toFixed(2);
            ingredient.ash           = ingredient.ash.toFixed(2);
        }

        if (!sessionStorage.getItem('error')) {
            // Lägger till ingrediensen i arrayen
            ingredients.push(ingredient);
            
            // Skriver ut ett bekräftelsemeddelande
            this.setState(/* state => */ {
                confirm:        true,
                confirmMessage: 'Ingrediensen har lagts till.',
            })

            setTimeout(() => {
                this.setState({
                    confirm:        false,
                    confirmMessage: '',
                })
            }, 5000);
        }
    }

    // Lägger till måltiden i databasen
    addMeal(e) {
        // Förhindrar att sidan laddas om när formuläret skickas
        e.preventDefault();
        // Ändrar status
        this.setState({
            editMeals: false,
        });

        // Arrayen används för att räkna ut ett id
        let userMeals = this.state.meals;

        // Sorterar arrayen så att den högsta siffran hamnar sist
        userMeals.sort((a, b) => {
            return a.mealID - b.mealID;
        })

        if (!this.state.editMeals) {
            let date = new Date();
            // Måltiden som skickas med fetch-anropet. Summeringarna avrundas till en decimal.
            const body = {
                username:           sessionStorage.getItem('user'),
                mealName:           this.state.mealName,
                mealID:             userMeals[userMeals.length - 1].mealID + 1,
                meal:               Object.values(ingredients),
                totalCalories:      totalCalories.toFixed(2),
                totalProtein:       totalProtein.toFixed(2),
                totalCarbohydrates: totalCarbohydrates.toFixed(2),
                totalFats:          totalFats.toFixed(2),
                totalSalt:          totalSalt.toFixed(2),
                totalWater:         totalWater.toFixed(2),
                totalAsh:           totalAsh.toFixed(2),
                date:               date.toLocaleDateString()
            };

            // POST-anrop
            fetch('https://food-diary-rest-api.herokuapp.com/meals', {
                method:  'POST',
                headers: {'Content-Type': 'application/json',},
                body:    JSON.stringify(body),
            })
            // Konverterar svaret från JSON
            .then(response => response.json())
            .then((data) => {
                // Användarens måltider i en array, lägger till den nya måltiden och uppdaterar state-arrayen
                let mealArr = this.state.meals;
                mealArr.unshift(data);

                // Genererar ett bekräftelsemeddelande
                this.setState({
                    confirm:        true,
                    confirmMessage: 'Måltiden har lagts till.',
                    meals:          mealArr,
                });
            })
            .catch(() => {
                // Genererar ett felmeddelande vid serverfel
                this.setState({
                    error:        true,
                    errorMessage: 'Ett serverfel har uppstått. Det gick inte att lägga till måltiden.' 
                        + ' Försök igen senare.',
                })
            })

            // Tömmer arrayen med ingredienser
            ingredients = [];
        }
    }
    
    // Redigerar måltiden innan den uppdateras
    editMeal(e) {
        // Förhindrar att sidan laddas om
        e.preventDefault();

        // Objektet lagrar ingredienser
        let ingredient = {
            food:          '',
            category:      '',
            quantity:      '',
            calories:      '',
            protein:       '',
            carbohydrates: '',
            fats:          '',
            salt:          '',
            water:         '',
            ash:           ''
        };

        // Id för den måltid som redigeras
        const index = e.target.id.slice(4);

        // Uppdaterar status för lagring, borttagning och redigering
        this.setState({
            addMeals:    false,
            deleteMeals: false,
            editMeals:   true,
        });

        // Lagrar namn, ingredienser, id och datum för måltiden som redigeras
        this.state.meals.map(meal => {
            if (meal.mealID == index && meal.username == sessionStorage.getItem('user')) {
                inputs[0].value = meal.mealName;
                ingredients = meal.meal;

                sessionStorage.setItem('mealID', meal.mealID);
                sessionStorage.setItem('mealName', meal.mealName);
                sessionStorage.setItem('date', meal.date);

                this.setState({
                    meal: meal,
                })
            }
        })

        /* Lagrar längden på arrayen med ingredienser som ingår i måltiden.
            Denna array används för att fylla i formuläret. */
        const length = ingredients.length;

        /* Inmatningsfälten fylls i med befintliga värden från arrayen i syfte att
            underlätta redigeringen */ 
        if (count < length) {
            inputs[1].value = ingredients[count].food;
            inputs[2].value = ingredients[count].category;
            inputs[3].value = ingredients[count].quantity;
            inputs[4].value = ingredients[count].calories;    
            inputs[5].value = ingredients[count].protein; 
            inputs[6].value = ingredients[count].carbohydrates;
            inputs[7].value = ingredients[count].fats;
            inputs[8].value = ingredients[count].salt;
            inputs[9].value = ingredients[count].water;
            inputs[10].value = ingredients[count].ash;

            this.setState({
                food:             this.state.meal.food,
                category:         this.state.meal.category,
                quantity:         this.state.meal.quantity,
                calories:         this.state.meal.calories,
                protein:          this.state.meal.protein,
                carbohydrates:    this.state.meal.carbohydrates,
                fats:             this.state.meal.fats,
                salt:             this.state.meal.salt,
                water:            this.state.meal.water,
                ash:              this.state.meal.ash,
            })
        }

        if (e.target.className == 'submit') {
            /* Här kontrolleras att alla inmatningsfält är ifyllda.
                Om så inte är fallet, skrivs ett felmeddelande ut. */
            for (let i = 0; i < inputs.length; i++) {
                if (inputs[i].value == '') {
                    sessionStorage.setItem('error', true);

                    this.setState({
                        error:        true,
                        errorMessage: 'Alla fält är obligatoriska.',
                    });
    
                } else {
                    sessionStorage.removeItem('error');

                    this.setState({
                        error:        false,
                        errorMessage: '',
                    });
                }
            }
    
            /* Om formuläret är korrekt ifyllt, lagras inmatningarna i objektet.
                Näringstäthet och näringsvärde för varje ingrediens och måltiden i helhet
                beräknas och lagras. Detta sker på exakt samma sätt som vid lagring av måltider.
                Sedan läggs ingrediensen till i arrayen med uppdaterade ingredienser,
                ett bekräftelsemeddelande skrivs ut och variabelns värde ökas inför nästa anrop. */

            if (!sessionStorage.getItem('error')) {    
                ingredient.food     = this.state.food;
                ingredient.category = this.state.food;
                
                if (this.state.quantity.indexOf(',') != -1) {
                    ingredient.quantity = this.state.quantity.replace(',', '.');
                } else {
                    ingredient.quantity = this.state.quantity;
                }
    
                if (this.state.calories.indexOf(',') != -1) {
                    ingredient.calories = this.state.calories.replace(',', '.');
                } else {
                    ingredient.calories = this.state.calories;
                }
    
                if (this.state.protein.indexOf(',') != -1) {
                    ingredient.protein = this.state.protein.replace(',', '.');
                } else {
                    ingredient.protein = this.state.protein;
                }
    
                if (this.state.carbohydrates.indexOf(',') != -1) {
                    ingredient.carbohydrates = this.state.carbohydrates.replace(',', '.');
                } else {
                    ingredient.carbohydrates = this.state.carbohydrates;
                }
    
                if (this.state.fats.indexOf(',') != -1) {
                    ingredient.fats = this.state.fats.replace(',', '.');
                } else {
                    ingredient.fats = this.state.fats;
                }
    
                if (this.state.salt.indexOf(',') != -1) {
                    ingredient.salt = this.state.salt.replace(',', '.');
                } else {
                    ingredient.salt = this.state.salt;
                }
    
                if (this.state.water.indexOf(',') != -1) {
                    ingredient.water = this.state.water.replace(',', '.');
                } else {
                    ingredient.water = this.state.water;
                }
    
                if (this.state.ash.indexOf(',') != -1) {
                    ingredient.ash = this.state.ash.replace(',', '.');
                } else {
                    ingredient.ash = this.state.ash;
                }
    
                let percentage = ingredient.quantity / 100;
    
                totalCalories            += (parseFloat(ingredient.calories) * percentage);
                ingredient.calories      =  (parseFloat(ingredient.calories) * percentage);
                totalProtein             += (parseFloat(ingredient.protein) * percentage);
                ingredient.protein       =  (parseFloat(ingredient.protein) * percentage);
                totalCarbohydrates       += (parseFloat(ingredient.carbohydrates) * percentage);
                ingredient.carbohydrates =  (parseFloat(ingredient.carbohydrates) * percentage);
                totalFats                += (parseFloat(ingredient.fats) * percentage);
                ingredient.fats          =  (parseFloat(ingredient.fats) * percentage);
                totalSalt                += (parseFloat(ingredient.salt) * percentage);
                ingredient.salt          =  (parseFloat(ingredient.salt) * percentage);
                totalWater               += (parseFloat(ingredient.water) * percentage);
                ingredient.water         =  (parseFloat(ingredient.water) * percentage);
                totalAsh                 += (parseFloat(ingredient.ash) * percentage);
                ingredient.ash           =  (parseFloat(ingredient.ash) * percentage);

                // Avrundar näringsvärdena till en decimal
                ingredient.protein       = ingredient.protein.toFixed(2);
                ingredient.carbohydrates = ingredient.carbohydrates.toFixed(2);
                ingredient.fats          = ingredient.fats.toFixed(2);
                ingredient.salt          = ingredient.salt.toFixed(2);
                ingredient.water         = ingredient.water.toFixed(2);
                ingredient.ash           = ingredient.ash.toFixed(2);
            }

            if (!sessionStorage.getItem('error')) {
                this.setState({
                    confirm:        true,
                    confirmMessage: 'Ingrediensen har uppdaterats.',
                })
            }

            setTimeout(() => {
                this.setState({
                    confirm:        false,
                    confirmMessage: '',
                })
            }, 5000);
        }

        count++;
    }

    // Här uppdateras måltiden i databasen
    updateMeal(e) {
        // Förhindrar att sidan laddas om
        e.preventDefault();

        /* Body med de uppdaterade värdena. Summeringarna avrundas till en decimal. */
        const body = {
            username:           sessionStorage.getItem('user'),
            mealID:             sessionStorage.getItem('mealID'),
            mealName:           sessionStorage.getItem('mealName'),
            meal:               Object.values(updatedIngredients),
            totalCalories:      totalCalories.toFixed(2),
            totalProtein:       totalProtein.toFixed(2),
            totalCarbohydrates: totalCarbohydrates.toFixed(2),
            totalFats:          totalFats.toFixed(2),
            totalSalt:          totalSalt.toFixed(2),
            totalWater:         totalWater.toFixed(2),
            totalAsh:           totalAsh.toFixed(2),
            date:               sessionStorage.getItem('date'),
        }

        // PUT-anrop
        if (this.state.editMeals) {
            fetch(`https://food-diary-rest-api.herokuapp.com/meals/id/${body.mealID}/user/${body.username}`, {
                method:  'PUT',
                headers: {'Content-Type': 'application/json',},
                body:    JSON.stringify(body),
            })
            // Konverterar svaret från JSON
            .then(response => response.json())
            .then((data) => {
                /* Användarens måltider i en array, lägger till den uppdaterade måltiden och 
                    uppdaterar state-arrayen */
                let mealArr = this.state.meals;

                for (let i = 0; i < mealArr.length; i++) {
                    if (mealArr[i].id == data.id) {
                        mealArr.splice(i, 1, data);
                    }
                }

                // Genererar ett bekräftelsemeddelande
                this.setState({
                    confirm:        true,
                    confirmMessage: 'Måltiden har uppdaterats.',
                    meals:          mealArr,
                });
            })
            .catch(() => {
                // Genererar ett felmeddelande vid serverfel
                this.setState({
                    error:        true,
                    errorMessage: 'Ett serverfel har uppstått. Det gick inte att uppdatera måltiden.'
                        + ' Försök igen senare.'
                })
            })

            // Tömmer arrayerna med ingredienser
            ingredients        = [];
            updatedIngredients = [];
        }
    }

    // Raderar måltider
    deleteMeal(e) {
        // Förhindrar att sidan laddas om
        e.preventDefault();
        // Lagrar måltidens id
        const index = e.target.id.slice(6);

        this.setState({
            addMeals:    false,
            editMeals:   false,
            deleteMeals: true,
        });

        // DELETE-anrop
        fetch(`https://food-diary-rest-api.herokuapp.com/meals/id/${index}/user/${sessionStorage.getItem('user')}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},   
        })

        // Konverterar svaret från JSON
        .then(response => response.json())
        .then(() => {
            /* Användarens måltider i en array, tar bort den raderade måltiden och 
                uppdaterar state-arrayen */
            let mealArr = this.state.meals;
            
            for (let i = 0; i < mealArr.length; i++) {
                if (mealArr[i].mealID == index) {
                    mealArr.splice(i, 1);
                }
            }

            // Genererar ett bekräftelsemeddelande
            this.setState({
                confirm:        true,
                confirmMessage: 'Måltiden har raderats.',
                meals:          mealArr,
            });
        })
        .catch(() => {
            // Genererar ett felmeddelande vid serverfel
            this.setState({
                error:        true,
                errorMessage: 'Ett serverfel har uppstått. Det gick inte att radera måltiden.'
                    + ' Försök igen senare.'
            });
        })
    }
}   

// Exporterar komponenten
export default Admin;