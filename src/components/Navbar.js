import React, {useContext, useEffect} from 'react'
import SearchTokenInput from './SearchTokenInput';
import {Web3Context} from './Contexts/Web3Context';
//import {BlockContext} from './Contexts/useBlockContext';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const Navbar = (props) => {

    const web3Con = useContext(Web3Context)
    const web3 = web3Con.web3
    


  const connectWallet = async ()=>{
     await web3Con.ethEnabled()
    }

    return (
        <div className="nav-bar">
            <div id="icon-container">
                <img 
                id="logo"
                src={'../diamondLogo.png'}/>
                <p id="site-title">Diamond Charts</p>
                </div>
                
                <SearchTokenInput tokenAddressInput={props.tokenAddressInput} 
                OntokenAddressInput={props.OntokenAddressInput}/>
       
                <div id="bnb-Price-container">
                   <span style={{color: 'white'}}> BNB Price: ${web3Con.bnbPrice.toFixed(2)}</span>
                </div>
            {web3Con.isWalletConnect == true ? <div style={{display: 'flex'}}>
                <p id="connect-address">...
                    {window.ethereum.selectedAddress.toString().substring(window.ethereum.selectedAddress.length - 6, window.ethereum.selectedAddress.length).toUpperCase()}
                    </p>
                </div>  : <button id="connect-wallet-btn" onClick={connectWallet} >Connect</button>} 
            </div>
        
    )
}


export default Navbar
