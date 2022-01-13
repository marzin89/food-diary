// Importerar, React och CSS
import React from 'react';
import './css/styles.css';

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

let meal = [];
let mealArr = [];

// Admin-formuläret
class AdminForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleActionChange = this.handleActionChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleFoodChange = this.handleFoodChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.handleCaloriesChange = this.handleCaloriesChange.bind(this);
        this.handleProteinChange = this.handleProteinChange.bind(this);
        this.handleCarbohydratesChange = this.handleCarbohydratesChange.bind(this);
        this.handleFatsChange = this.handleFatsChange.bind(this);
        this.handleSaltChange = this.handleSaltChange.bind(this);
        this.handleWaterChange = this.handleWaterChange.bind(this);
        this.handleAshChange = this.handleAshChange.bind(this);
        this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
        this.addFood = this.addFood.bind(this);
        this.addMeal = this.addMeal.bind(this);
        this.editMeal = this.editMeal.bind(this);
        this.updateMeal = this.updateMeal.bind(this);
        this.deleteMeal = this.deleteMeal.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        /* fetch(`https://damp-beach-42759.herokuapp.com/meals/${this.state.username}`)
        .then(response => response.json())
        .then(data => data.forEach(meal => {
            mealArr.push(meal);
        })
        .catch(err => {
            this.setState({
                error:        true,
                errorMessage: err,
            })
        })) */

        this.state = {
            addMeals: true,
            getMeals: false,
            editMeals: false,
            deleteMeals: false,
            addMoreMeals: true,
            dateRange: 'Senaste veckan',
            meal: {
                username: props.username,
                mealName: '',
                mealID: '',
                ingredients: [],
                totalCalories: '',
                totalProtein: '',
                totalCarbohydrates: '',
                totalFats: '',
                totalSalt: '',
                totalWater: '',
                totalAsh: '',
                date: ''
            },
            ingredients: [],
            ingredient: {
                food:          '',
                category:      '',
                quantity:      '',
                calories:      '',
                protein:       '',
                carbohydrates: '',
                fats:          '',
                salt:          '',
                water:         '',
                ash:           '',
            },
            error: false,
            errorMessage: '',
            confirm: false,
            confirmMessage: '',
        }
    }

    render() {
        return (
            <div className={this.props.className} style={
                    this.props.className == 'hidden' ? {display: 'none'} : {display: 'block'}
                }>
                <section>
                    <h1>Välkommen till kostdagboken!</h1>
                    <p><a href="index.html" onClick={this.handleLogout}>Logga ut</a></p>
                </section>
                <form action="index.html" method="post" id="admin-form">
                    <select name="admin-select-action" id="admin-select-action" 
                        onChange={this.handleActionChange}>
                        <option value="Hämta måltider" selected={ this.state.getMeals ? true : false }
                            >Hämta måltider</option>
                        <option value="Lägg till måltider" selected={this.state.addMeals ? true : false }
                            >Lägg till måltider</option>
                    </select>
                    <div id="get-meals" style={ this.state.getMeals ? {display: 'block'} : {display: 'none'} }>
                        <div id="get-all-meals">
                            <input type="radio" name="get-meals-options" id="get-all-meals-radio"
                                className="admin-form-radio-left"></input>
                            <label htmlFor="get-all-meals-radio" className="admin-form-radio-right">Alla måltider</label>
                        </div>
                        <div id="get-meals-date-range">
                            <input type="radio" name="get-meals-options" id="get-meals-date-range-radio"
                                className="admin-form-radio-left" checked></input>
                            <label htmlFor="get-meals-date-range" className="admin-form-radio-right">Begränsad tidsperiod</label>
                        </div>
                        <select id="date-range" onChange={this.handleDateRangeChange}>
                            <option value="Senaste veckan">Senaste veckan</option>
                            <option value="Senaste månaden">Senaste månaden</option>
                            <option value="Senaste tre månaderna">Senaste tre månaderna</option>
                            <option value="Senaste halvåret">Senaste halvåret</option>
                            <option value="Senaste året">Senaste året</option>
                        </select>
                    </div>
                    <div id="add-meals" style={ this.state.addMeals ? {display: 'block'} : {display: 'none'}}>
                        <h2>Måltid 1</h2>
                        <label htmlFor="meal-name">Namn på måltiden</label>
                        <input type="text" id="meal-name" onClick={this.handleNameChange}></input>
                        <h3>Lägg till en ingrediens</h3>
                        <div id="ingredient-list">
                            <input type="text" className="ingredient-name" placeholder="Namn *"
                                onChange={this.handleFoodChange}></input>
                            <h4>Välj kategori</h4>
                            <select name="food-category" id="food-category" onChange={this.handleCategoryChange}>
                                <option value=""></option>
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
                            <input type="text" className="quantity" placeholder="Mängd (g)" 
                                onChange={this.handleQuantityChange}></input>
                            <input type="text" className="calories" placeholder="Kalorier (kcal)"
                                onChange={this.handleCaloriesChange}></input>
                            <input type="text" className="protein" placeholder="Protein (g)"
                                onChange={this.handleProteinChange}></input>
                            <input type="text" className="carbohydrates" placeholder="Kolhydrater (g)"
                                onChange={this.handleCarbohydratesChange}></input>
                            <input type="text" className="fats" placeholder="Fett (g)"
                                onChange={this.handleFatsChange}></input>
                            <input type="text" className="salt" placeholder="Salt (g)"
                                onChange={this.handleSaltChange}></input>
                            <input type="text" className="water" placeholder="Vatten (g)"
                                onChange={this.handleWaterChange}></input>
                            <input type="text" className="ash" placeholder="Aska (g)"
                                onChange={this.handleAshChange}></input>
                        </div>
                        <input type="submit" value="Lägg till ingrediens" onClick={this.addFood}></input>
                        <input type="submit" value="Lägg till måltid" onClick={this.addMeal}></input>
                        <input type="reset" value="Rensa" id="reset"></input>
                    </div>
                    <input type="submit" value="Hämta måltider" id="get-meals-submit" 
                        style={ this.state.getMeals ? {display: 'block'} : {display: 'none'} }></input>
                    <p className="error" style={this.state.error ? {display: 'block'} : {display: 'none'}}>
                        {this.state.errorMessage}</p>
                    <p className="confirm" style={this.state.confirm ? {display: 'block'} : {display: 'none'}}>
                        {this.state.confirmMessage}</p>
                </form>
                <section style={mealArr.length ? {display: 'block'} : {display: 'none'}}>
                    {mealArr.forEach(meal => {
                        let index = 0;
                            <div>
                                <h3>Måltid</h3>
                                <p>{meal.mealName}</p>
                                {meal.forEach(food => {
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>Ingrediens</td>
                                                <td>{food.food}</td>
                                            </tr>
                                            <tr>
                                                <td>Kategori</td>
                                                <td>{food.category}</td>
                                            </tr>
                                            <tr>
                                                <td>Mängd</td>
                                                <td>{food.quantity} g</td>
                                            </tr>
                                            <tr>
                                                <td>Kalorier</td>
                                                <td>{food.calorier} kcal</td>
                                            </tr>
                                            <tr>
                                                <td>Protein</td>
                                                <td>{food.protein} g</td>
                                            </tr>
                                            <tr>
                                                <td>Kolhydrater</td>
                                                <td>{food.carbohydrates} g</td>
                                            </tr>
                                            <tr>
                                                <td>Fett</td>
                                                <td>{food.fats} g</td>
                                            </tr>
                                            <tr>
                                                <td>Salt</td>
                                                <td>{food.salt} g</td>
                                            </tr>
                                            <tr>
                                                <td>Vatten</td>
                                                <td>{food.water} g</td>
                                            </tr>
                                            <tr>
                                                <td>Aska</td>
                                                <td>{food.ash} g</td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td><a href={`index.html?edit=1&id=${index}`}
                                                    onClick={this.editMeal}>Redigera</a></td>
                                                <td><a href={`index.html?delete=1&id=${index}`}
                                                    onClick={this.deleteMeal}>Radera</a></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                
                                })
                            };
                        </div>
                        index++;
                    })}
                </section>
            </div>
        )
    }

    handleActionChange(e) {
        if (e.target.value == 'Hämta måltider') {
            this.setState({
                getMeals: true,
                addMeals: false,
            });
        } else if (e.target.value == 'Lägg till måltider') {
            this.setState({
                getMeals: false,
                addMeals: true,
            })
        }
    }

    handleNameChange(e) {
        this.setState({meal: {mealName: e.target.value}});
    }

    handleFoodChange(e) {
        ingredient.food = e.target.value;
        this.setState({ingredient: {food: e.target.value}});
        // this.setState({ingredient: {food: e.target.value}});
    }

    handleCategoryChange(e) {
        ingredient.category = e.target.value;
        this.setState({ingredient: {category: e.target.value}});
        // this.setState({ingredient: {category: e.target.value}});
    }

    handleQuantityChange(e) {
        ingredient.quantity = e.target.value;
        this.setState({ingredient: {quantity: e.target.value}});
        // this.setState({ingredient: {quantity: e.target.value}});
    }

    handleCaloriesChange(e) {
        ingredient.calories = e.target.value;
        this.setState({ingredient: {calories: e.target.value}});
        // this.setState({ingredient: {calories: e.target.value}});
    }

    handleProteinChange(e) {
        ingredient.protein = e.target.value;
        this.setState({ingredient: {protein: e.target.value}});
        // this.setState({ingredient: {protein: e.target.value}});
    }

    handleCarbohydratesChange(e) {
        ingredient.carbohydrates = e.target.value;
        this.setState({ingredient: {carbohydrates: e.target.value}});
        // this.setState({ingredient: {carbohydrates: e.target.value}});
    }

    handleFatsChange(e) {
        ingredient.fats = e.target.value;
        this.setState({ingredient: {fats: e.target.value}});
        // this.setState({ingredient: {fats: e.target.value}});
    }

    handleSaltChange(e) {
        ingredient.salt = e.target.value;
        this.setState({ingredient: {salt: e.target.value}});
        // this.setState({ingredient: {salt: e.target.value}});
    }

    handleWaterChange(e) {
        ingredient.water = e.target.value;
        this.setState({ingredient: {water: e.target.value}});
        // this.setState({ingredient: {water: e.target.value}});
    }

    handleAshChange(e) {
        ingredient.ash = e.target.value;
        this.setState({ingredient: {ash: e.target.value}});
    }

    addFood(e) {
        e.preventDefault();
        for (const [key, value] of Object.entries(ingredient)) {
            if (value == '') {
                this.setState({
                    error: true,
                    errorMessage: 'Alla fält är obligatoriska.',
                });
            } else {
                this.setState({
                    ingredients: [...this.state.ingredients, ingredient],
                });
                this.setState({
                    confirm: true,
                    confirmMessage: 'Ingrediensen har lagts till.',
                });
            }
        }
    }

    addMeal(e) {
        e.preventDefault();
        this.setState({
            editMeals: false,
            confirm: true,
            confirmMessage: 'Måltiden har lagts till.',
        });

        /* if (!this.state.editMeals) {
            const body = this.state.meal;
            fetch('https://damp-beach-42759.herokuapp.com/meals', {
                method:  'POST',
                headers: {'Content-Type': 'application/json',},
                body:    JSON.stringify(body),
            })
            .then(response => response.json())
            .then(data => {
                this.setState({confirm: data.message});
            })
            .catch(err => {
                this.setState({
                    error:        true,
                    errorMessage: err,
                })
            })
        } */
    }
    
    editMeal(e) {
        e.preventDefault();
        const index = e.target.href.id;
        meal = mealArr[index];
        this.meal.setState({
            editMeals: true,
            mealName: meal[0].mealName,
            mealID:   meal[0].mealID,
            meal: meal,
        });
        
    }

    updateMeal(e) {
        e.preventDefault();
        this.setState({meal: meal});
        if (this.state.editMeals) {
            const body = this.state.meal;
            fetch(`https://damp-beach-42759.herokuapp.com/meals/${this.state.meal.mealID}/${this.state.username}`, {
                method:  'PUT',
                headers: {'Content-Type': 'application/json',},
                body:    JSON.stringify(body),
            })
            .then(response => response.json())
            .then(data => {
                this.setState({confirm: data.message});
            })
            .catch(err => {
                this.setState({
                    error:        true,
                    errorMessage: err,
                })
            })
        }
    }

    deleteMeal(e) {
        e.preventDefault();
        const index = e.target.href.id;
        meal = mealArr[index];

        this.setState({
            addMeals:    false,
            editMeals:   false,
            deleteMeals: true,
        });

        this.meal.setState({
            mealID: meal.mealID
        });

        if (this.state.deleteMeals) {
            fetch(`https://damp-beach-42759.herokuapp.com/meals/${this.state.mealID}/${this.state.username}`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json',},
                
            })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    confirm: data.message,
                });
            })
            .catch(err => {
                this.setState({
                    error: err,
                });
            })
        }
    }

    handleDateRangeChange(e) {
        this.setState({dateRange: e.target.value});
    }

    handleLogout(e) {
        e.preventDefault();
        this.props.function();
    }
}   

AdminForm.defaultProps = {
    className: 'hidden',
}

export default AdminForm;