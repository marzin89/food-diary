// Imports
import React from 'react';
import './css/styles.css';

// Komponent som visar resultat
function Result(props) {
    return (
        <table className={props.className} style={ 
                props.className == 'hidden' ? {display: 'none'} : {display: 'block'}}>
            <tbody>
                <tr>
                    <td className="table-left">Livsmedel</td>
                    <td className="table-right">{props.name}</td>
                </tr>
                <tr>
                    <td className="table-left">Kategori</td>
                    <td className="table-right">{props.category}</td>
                </tr>
                <tr>
                    <td className="table-left">Kalorier</td>
                    <td className="table-right">{props.calories}</td>
                </tr>
                <tr>
                    <td className="table-left">Protein</td>
                    <td className="table-right">{props.protein}</td>
                </tr>
                <tr>
                    <td className="table-left">Kolhydrater</td>
                    <td className="table-right">{props.carbohydrates}</td>
                </tr>
                <tr>
                    <td className="table-left">Fett</td>
                    <td className="table-right">{props.fats}</td>
                </tr>
                <tr>
                    <td className="table-left">Salt</td>
                    <td className="table-right">{props.salt}</td>
                </tr>
                <tr>
                    <td className="table-left">Vatten</td>
                    <td className="table-right">{props.water}</td>
                </tr>
                <tr>
                    <td className="table-left">Aska</td>
                    <td className="table-right">{props.ash}</td>
                </tr>
            </tbody>
        </table> 
    );
}

Result.defaultProps = {
    className: 'hidden',
}

// Sökformuläret på startsidan
class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.foodNameInput = React.createRef();
        this.foodCategoryInput = React.createRef();
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            submitted: false,
            foodName: '',
            foodCategory: '',
            foods: [],
            error: false,
            errorMessage: '',
        }
    }
    
    render() {
        return (
            <div className={this.props.className} style={this.props.className == 'hidden' ? 
                    {display: 'none'} : {display: 'block'}}>
                <form action="index.html" method="get" onSubmit={this.handleSubmit}>
                    <div>
                        <label htmlFor="food-name">Livsmedel</label>
                        <input type="text" id="food-name" autoComplete="off"
                            ref={this.foodNameInput} onChange={this.handleNameChange}></input>
                        <select name="food-name-autofill" id="food-name-autofill"></select>
                    </div>
                    <div>
                        <label htmlFor="food-category">Kategori</label>
                        <select name="food-category" id="food-category" ref={this.foodCategoryInput}
                            onChange={this.handleCategoryChange}>
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
                    </div>
                    <input type="submit" id="submit" value="Sök"></input>
                    <input type="reset" value="Rensa" id="reset"></input>
                    <p style={ this.state.error ? {display: 'block'} : {display: 'none'}}>
                        {this.state.errorMessage}</p>
                </form>
                <section id="output">
                    { this.state.submitted && !this.state.error ? <Result className="display" /> : <Result /> }
                </section>
            </div>
        )
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({submitted: true});
        if (!this.state.foodName && !this.state.foodCategory) {
            this.setState({
                error: true,
                errorMessage: 'Du måste ange ett livsmedel eller välja en kategori.',
            })
        } else {
            this.setState({
                error: false,
                errorMessage: '',
            })
        }
    }

    handleNameChange(e) {   
        this.setState({foodName: e.target.value});
    }

    handleCategoryChange(e) {
        this.setState({foodCategory: e.target.value});
    }
}

SearchForm.defaultProps = {
    className: 'display',
}

// Exporterar komponenten
export default SearchForm;