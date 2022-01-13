'use strict';

const foodNameInput = document.getElementById('food-name');
const foodCategoryInput = document.getElementById('food-category');
const foodNameAutofill = document.getElementById('food-name-autofill');
const output = document.getElementById('result');
const submit = document.getElementById('submit');
let foodName;
let foodCategory;
let foodArr = [];

foodNameInput.addEventListener('input', () => {
    if (foodNameInput.value) {
        foodName = foodNameInput.value;
    }
    
    if (foodNameInput.value) {
        let count = 0;

        foodArr.forEach(element => {
        if (element.name.toLowerCase().indexOf(foodNameInput.value.toLowerCase()) !== -1) {
                foodNameAutofill.style.display = 'block';
                const option = document.createElement('option');
                option.innerHTML = element.name;
                foodNameAutofill.appendChild(option); 
                count++;
            }
        });

        foodNameAutofill.size = count;
    } else {
        foodNameAutofill.style.display = 'none';
    }
});

foodCategoryInput.addEventListener('change', () => {
    if (foodCategoryInput.selectedIndex > 0) {
        let index = foodCategoryInput.selectedIndex;
        foodCategory = foodCategoryInput[index].value;
    }
});

submit.addEventListener('click', (e) => {
    e.preventDefault();
    searchFood();
});

function searchFood() {
    if (foodName) {
        if (foodCategory) {
            if (output.innerHTML) {
                output.innerHTML = '';
            }

            foodArr.forEach(element => {
                if (element.name == foodName && element.category == foodCategory) {
                    output.innerHTML +=
                    `<table>
                        <tr>
                            <td class="table-left">Livsmedel</td>
                            <td class="table-right">${element.name}</td>
                        </tr>
                        <tr>
                            <td class="table-left">Kategori</td>
                            <td class="table-right">${element.category}</td>
                        </tr>
                        <tr>
                            <td class="table-left">Kalorier</td>
                            <td class="table-right">${element.calories}</td>
                        </tr>
                        <tr>
                            <td class="table-left">Protein</td>
                            <td class="table-right">${element.protein}</td>
                        </tr>
                        <tr>
                            <td class="table-left">Kolhydrater</td>
                            <td class="table-right">${element.carbohydrates}</td>
                        </tr>
                        <tr>
                            <td class="table-left">Fett</td>
                            <td class="table-right">${element.fats}</td>
                        </tr>
                        <tr>
                            <td class="table-left">Salt</td>
                            <td class="table-right">${element.salt}</td>
                        </tr>
                        <tr>
                            <td class="table-left">Vatten</td>
                            <td class="table-right">${element.water}</td>
                        </tr>
                        <tr>
                            <td class="table-left">Aska</td>
                            <td class="table-right">${element.ash}</td>
                        </tr>
                    </table>`;
                }
            })
        } else {
            if (output.innerHTML) {
                output.innerHTML = '';
            }

            foodArr.forEach(element => {
                if (element.name == foodName) {
                    output.innerHTML +=
                    `<table>
                        <tr>
                            <td class="table-left">Livsmedel</td>
                            <td class="table-right">${element.name}</td>
                        </tr>
                        <tr>
                            <td class="table-left">Kategori</td>
                            <td class="table-right">${element.category}</td>
                        </tr>
                        <tr>
                            <td class="table-left">Kalorier</td>
                            <td class="table-right">${element.calories}</td>
                        </tr>
                        <tr>
                            <td class="table-left">Protein</td>
                            <td class="table-right">${element.protein}</td>
                        </tr>
                        <tr>
                            <td class="table-left">Kolhydrater</td>
                            <td class="table-right">${element.carbohydrates}</td>
                        </tr>
                        <tr>
                            <td class="table-left">Fett</td>
                            <td class="table-right">${element.fats}</td>
                        </tr>
                        <tr>
                            <td class="table-left">Salt</td>
                            <td class="table-right">${element.salt}</td>
                        </tr>
                        <tr>
                            <td class="table-left">Vatten</td>
                            <td class="table-right">${element.water}</td>
                        </tr>
                        <tr>
                            <td class="table-left">Aska</td>
                            <td class="table-right">${element.ash}</td>
                        </tr>
                    </table>`;
                }
            })
        }
    } else if (!foodName && foodCategory) {
        if (output.innerHTML) {
            output.innerHTML = '';
        }

        foodArr.forEach(element => {
            if (element.category == foodCategory) {
                output.innerHTML +=
                `<table>
                    <tr>
                        <td class="table-left">Livsmedel</td>
                        <td class="table-right">${element.name}</td>
                    </tr>
                    <tr>
                        <td class="table-left">Kategori</td>
                        <td class="table-right">${element.category}</td>
                    </tr>
                    <tr>
                        <td class="table-left">Kalorier</td>
                        <td class="table-right">${element.calories}</td>
                    </tr>
                    <tr>
                        <td class="table-left">Protein</td>
                        <td class="table-right">${element.protein}</td>
                    </tr>
                    <tr>
                        <td class="table-left">Kolhydrater</td>
                        <td class="table-right">${element.carbohydrates}</td>
                    </tr>
                    <tr>
                        <td class="table-left">Fett</td>
                        <td class="table-right">${element.fats}</td>
                    </tr>
                    <tr>
                        <td class="table-left">Salt</td>
                        <td class="table-right">${element.salt}</td>
                    </tr>
                    <tr>
                        <td class="table-left">Vatten</td>
                        <td class="table-right">${element.water}</td>
                    </tr>
                    <tr>
                        <td class="table-left">Aska</td>
                        <td class="table-right">${element.ash}</td>
                    </tr>
                </table>`;
            }
        });
    }

    foodName = '';
    foodCategory = '';
}

fetch('/foods')
.then(response => response.json())
.then(data => data.forEach(element => {
    foodArr.push(element);
}));