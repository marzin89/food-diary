// Importerar React
import React from 'react';

// Sidfot med "dynamiskt" år 
function Footer(props) {
    return (
        <footer>
            <p id="copyright">Copyright {props.year}</p>
        </footer>
    )
}

// Exporterar komponenten
export default Footer;