// Importerar, React/ReactDOM och App.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Rendrerar applikationen i body
ReactDOM.render( 
<React.StrictMode>
  <App />
</React.StrictMode>,
  document.querySelector('body')
);
