// Importerar React och sökformuläret
import React from 'react';
import { useState } from 'react/cjs/react.production.min';
import Search from '../search/search';

// Inmatningsfält för måltider
const inputs = document.getElementsByClassName('meal-input');

// Admin
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
        this.deleteMeal                = this.deleteMeal.bind(this);
        this.handleLogout              = this.handleLogout.bind(this);
        this.setState                  = this.setState.bind(this);

        this.state = {
            /* Dessa properties används främst för att styra gränssnittets 
            utseende beroende på vad som ska göras */
            addMeals:           true,
            getAllMeals:        true,
            getSelectedMeals:   false,
            deleteMeals:        false,
            // Tidsintervall vid filtrering av måltider
            dateRange:          '',
            // Måltider
            meals:              [],
            // Ingredienser
            ingredients:        [],
            // Namn, livsmedel, kategori, mängd, näringstäthet och näringsvärde
            mealName:           sessionStorage.getItem('name'),
            food:               '',
            category:           '',
            quantity:           '',
            calories:           '',
            protein:            '',
            carbohydrates:      '',
            fats:               '',
            salt:               '',
            water:              '',
            ash:                '',
            // Summering av hela måltiden 
            totalCalories:      0,
            totalProtein:       0,
            totalCarbohydrates: 0,
            totalFats:          0,
            totalSalt:          0,
            totalWater:         0,
            totalAsh:           0,
            // Fel- och bekräftelsemeddelanden (skrivs ut om true)
            error:                 false,
            errorMessage:          '',
            // Denna visas bara om inget tidsintervall har valts
            errorMessageDateRange: '',
            confirm:               false,
            confirmMessage:        '',
        }

        // Ändrar sidans namn
        document.title = 'Admin';

        // Hämtar alla måltider när komponenten laddas
        this.getAllMeals();
    }

    // Rendrering
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
                        <input className="submit" type="submit" value="Lägg till ingrediens" 
                            onClick={this.addFood}></input>
                        {/* Lägger till måltiden */}
                        <input className="submit-meal" type="submit" value="Lägg till måltid" 
                            onClick={this.addMeal}></input>
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
                        {/* Här väljer användaren tidsperiod */}
                        <select id="date-range" onChange={this.handleDateRangeChange}>
                            <option value="">-</option>
                            <option value="Senaste veckan">Senaste veckan</option>
                            <option value="Senaste månaden">Senaste månaden</option>
                            <option value="Senaste tre månaderna">Senaste tre månaderna</option>
                            <option value="Senaste halvåret">Senaste halvåret</option>
                            <option value="Senaste året">Senaste året</option>
                        </select>
                    </div>
                    {/* Hämtar måltider vid klick */}
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
                                    {/* Länk för borttagning */}
                                    <tr>
                                        <td className="meal-heading"></td>
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
                // Lagrar ett felmeddelande om inga måltider hittades
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

    // Funktionen körs när formuläret skickas
    getMeals(e) {
        // Förhindrar att sidan laddas om
        e.preventDefault();
        /* Beroende på vad som finns lagras i state så hämtas alla måltider,
            eller måltider för vald tidsperiod. Om användaren har valt att
            filtrera på datum, men inte angett någon tidsperiod, skrivs ett
            felmeddelande ut. Annars tas eventuella felmeddelanden bort. */
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

        // Ändrar status
        this.setState({
            addMeals:    true,
            deleteMeals: false,
        });

        // Här lagras ingrediensen. Varje objekt läggs till i state-arrayen (ingredients)
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
                /* sessionStorage används här eftersom setState är asynkront. 
                    Vilket leder till att valideringen "lyckas" om jag använder
                    setState/state, även om något/några inmatningsfält är tomma. */ 
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
            /* Lagrar ingrediensen i objektet. Eventuella kommatecken byts ut mot punkt.
                Detta krävs för att det ska gå att beräkna näringsvärdet längre ner. */
            ingredient.food          = this.state.food;
            ingredient.category      = this.state.category;
            
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

            /* Här räknas näringstäthet och -värde ut för ingrediensen och måltiden totalt.
                Eftersom användaren anger dessa värden per 100 gram, måste procentandelen
                för den angivna mängden räknas ut. Värdena görs om till flyttal och multipliceras 
                med procentandelen. */ 
            let percentage = ingredient.quantity / 100;

            let calories             = (parseFloat(ingredient.calories)       * percentage);
            ingredient.calories      =  (parseFloat(ingredient.calories)      * percentage);
            let protein              = (parseFloat(ingredient.protein)        * percentage);
            ingredient.protein       =  (parseFloat(ingredient.protein)       * percentage);
            let carbohydrates        = (parseFloat(ingredient.carbohydrates)  * percentage);
            ingredient.carbohydrates =  (parseFloat(ingredient.carbohydrates) * percentage);
            let fats                 = (parseFloat(ingredient.fats)           * percentage);
            ingredient.fats          =  (parseFloat(ingredient.fats)          * percentage);
            let salt                 = (parseFloat(ingredient.salt)           * percentage);
            ingredient.salt          =  (parseFloat(ingredient.salt)          * percentage);
            let water                = (parseFloat(ingredient.water)          * percentage);
            ingredient.water         =  (parseFloat(ingredient.water)         * percentage);
            let ash                  = (parseFloat(ingredient.ash)            * percentage);
            ingredient.ash           =  (parseFloat(ingredient.ash)           * percentage);

            // Lagrar/uppdaterar summeringen i state
            this.setState({
                totalCalories:      this.state.totalCalories      + calories,
                totalProtein:       this.state.totalProtein       + protein,
                totalCarbohydrates: this.state.totalCarbohydrates + carbohydrates,
                totalFats:          this.state.totalFats          + fats,
                totalSalt:          this.state.totalSalt          + salt,
                totalWater:         this.state.totalWater         + water,
                totalAsh:           this.state.totalAsh           + ash,
            })

            // Avrundar näringsvärdena till två decimaler
            ingredient.calories      = ingredient.calories.toFixed(2);
            ingredient.protein       = ingredient.protein.toFixed(2);
            ingredient.carbohydrates = ingredient.carbohydrates.toFixed(2);
            ingredient.fats          = ingredient.fats.toFixed(2);
            ingredient.salt          = ingredient.salt.toFixed(2);
            ingredient.water         = ingredient.water.toFixed(2);
            ingredient.ash           = ingredient.ash.toFixed(2);
        }

        if (!sessionStorage.getItem('error')) {
            // Lägger till ingrediensen i arrayen
            this.setState({
                ingredients: [...this.state.ingredients, ingredient],
            })
            
            // Skriver ut ett bekräftelsemeddelande
            this.setState({
                confirm:        true,
                confirmMessage: 'Ingrediensen har lagts till.',
            })

            // Tar bort bekräftelsemeddelandet efter fem sekunder
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

        // Arrayen används för att räkna ut ett id
        let userMeals = this.state.meals;

        /* Sorterar arrayen så att den högsta siffran hamnar sist.
            Id:t blir då lastIndex.id + 1. */
        userMeals.sort((a, b) => {
            return a.mealID - b.mealID;
        })

        let date = new Date();
        // Måltiden som skickas med fetch-anropet. Summeringarna avrundas till en decimal.
        const body = {
            username:           sessionStorage.getItem('user'),
            mealName:           this.state.mealName,
            mealID:             userMeals[userMeals.length - 1].mealID + 1,
            meal:               Object.values(this.state.ingredients),
            totalCalories:      this.state.totalCalories.toFixed(2),
            totalProtein:       this.state.totalProtein.toFixed(2),
            totalCarbohydrates: this.state.totalCarbohydrates.toFixed(2),
            totalFats:          this.state.totalFats.toFixed(2),
            totalSalt:          this.state.totalSalt.toFixed(2),
            totalWater:         this.state.totalWater.toFixed(2),
            totalAsh:           this.state.totalAsh.toFixed(2),
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
            /* Lagrar användarens måltider i en array, 
                lägger till den nya måltiden och uppdaterar state-arrayen */
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
    }

    // Raderar måltider
    deleteMeal(e) {
        // Förhindrar att sidan laddas om
        e.preventDefault();
        // Lagrar måltidens id
        const index = e.target.id.slice(6);

        // Ändrar status
        this.setState({
            addMeals:    false,
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
                    return mealArr;
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