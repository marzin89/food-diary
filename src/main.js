// Importerar, React och CSS
import React from 'react';
import './index.css';
import { Switch, Route } from 'react-router-dom';
import SearchForm from 'search-form';

// Innehåll
const Main = () => {
    <Switch>
        <Route path='/' component={ SearchForm }></Route> 
    </Switch>
}

// Exporterar komponenten
export default Main;