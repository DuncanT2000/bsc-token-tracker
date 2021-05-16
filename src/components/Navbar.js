import React, {useContext} from 'react'
import SearchTokenInput from './SearchTokenInput';
import {Web3Context} from './Contexts/Web3Context';
import {BlockContext} from './Contexts/useBlockContext';

const Navbar = (props) => {

    const web3Con = useContext(Web3Context)
    const web3 = web3Con.web3
    
  const BlockContextCon = useContext(BlockContext)

  const connectWallet = async ()=>{
      const res = await web3Con.ethEnabled() 
    }


    console.log(window.ethereum.selectedAddress)
    return (
        <div className="nav-bar">
            <h1>Navbar</h1>
            <SearchTokenInput tokenAddressInput={props.tokenAddressInput} OntokenAddressInput={props.OntokenAddressInput}/>
            <div style={{display: 'flex'}}>
            
            {window.ethereum.selectedAddress != null? 
            <p style={{border: '1px solid',borderRadius:50, padding:8, color:'white',marginRight:25}}>...{window.ethereum.selectedAddress.toString().substring(window.ethereum.selectedAddress.length - 6, window.ethereum.selectedAddress.length).toUpperCase()}</p> 
            : <button onClick={connectWallet} >Connect</button>} 
            </div>
        </div>
    )
}


export default Navbar
