import React from 'react'
import SearchTokenInput from './SearchTokenInput';

const Navbar = (props) => {
    return (
        <div className="nav-bar">
            <h1>Navbar</h1>
            <SearchTokenInput tokenAddressInput={props.tokenAddressInput} OntokenAddressInput={props.OntokenAddressInput}/>
            <div> </div>
        </div>
    )
}


export default Navbar
