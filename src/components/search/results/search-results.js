// Komponent som visar sökresultat
function SearchResults(props) {
    return (
        // Loopar igenom livsmedlen i props och skriver ut
        props.foods.map((food) => {
            return (
                <table key={food.id}>
                    <tbody>
                        <tr>
                            <td className="table-left">Livsmedel</td>
                            <td className="table-right">{food.name}</td>
                        </tr>
                        <tr>
                            <td className="table-left">Kategori</td>
                            <td className="table-right">{food.category}</td>
                        </tr>
                        <tr>
                            <td className="table-left">Kalorier</td>
                            <td className="table-right">{food.calories}</td>
                        </tr>
                        <tr>
                            <td className="table-left">Protein</td>
                            <td className="table-right">{food.protein}</td>
                        </tr>
                        <tr>
                            <td className="table-left">Kolhydrater</td>
                            <td className="table-right">{food.carbohydrates}</td>
                        </tr>
                        <tr>
                            <td className="table-left">Fett</td>
                            <td className="table-right">{food.fats}</td>
                        </tr>
                        <tr>
                            <td className="table-left">Salt</td>
                            <td className="table-right">{food.salt}</td>
                        </tr>
                        <tr>
                            <td className="table-left">Vatten</td>
                            <td className="table-right">{food.water}</td>
                        </tr>
                        <tr>
                            <td className="table-left">Aska</td>
                            <td className="table-right">{food.ash}</td>
                        </tr>
                    </tbody>
                </table> 
            )
        })
    );
}

// Exporterar komponenten
export default SearchResults;