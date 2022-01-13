// Imports
import React from 'react';
import './index.css';

// Formulär
class Form extends React.Component {
    render() {
        return(
            <form action="index.html" method="get">
                <div>
                    <label for="food-name">Livsmedel</label>
                    <input type="text" id="food-name" autocomplete="off"></input>
                    <select name="food-name-autofill" id="food-name-autofill"></select>
                </div>
                <div>
                    <label for="food-category">Kategori</label>
                    <select name="food-category" id="food-category">
                        <option value=""></option>
                        <option value="Frukt och bär">Frukt och bär</option>
                        <option value="Grönsaker">Grönsaker</option>
                        <option value="Potatis och rotfrukter">Potatis och rotfrukter</option>
                        <option value="Bröd, flingor, gryn, pasta och ris">
                            Bröd, flingor, gryn, pasta och ris</option>
                        <option value="Kött, fisk och ägg">Kött, fisk och ägg</option>
                        <option value="Mjölk och ost">Mjölk och ost</option>
                        <option value="Matfett">Matfett</option>
                    </select>
                </div>
                <div>
                    <input type="submit" id="submit" value="Sök"></input>
                </div>
            </form>
        )
    }
}

// Exporterar komponenten
export default Form;