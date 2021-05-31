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
            <div style={{
                    display:'flex', 
                alignItems: 'center', 
                marginLeft:'50px'}}>
                <LazyLoadImage 
                width={30}
                height={30}
                src={'../diamondLogo.png'}/>
                <h3>Diamond Charts</h3>
                </div>
                
                <SearchTokenInput tokenAddressInput={props.tokenAddressInput} OntokenAddressInput={props.OntokenAddressInput}/><div style={{display: 'flex'}}>
                <div style={{display: 'flex', alignItems: 'center' , marginRight:40}}>
                   <span style={{color: 'white'}}> BNB Price: ${web3Con.bnbPrice.toFixed(2)}</span>
                </div>
            {web3Con.isWalletConnect == true ? <div style={{display: 'flex'}}>
                <p style={{
                    border: '1px solid',
                    borderRadius:50, 
                    padding:8,
                    color:'white',
                    marginRight:25}}>...
                    {window.ethereum.selectedAddress.toString().substring(window.ethereum.selectedAddress.length - 6, window.ethereum.selectedAddress.length).toUpperCase()}
                    </p>
                </div>  : <button style={{marginRight:15}} onClick={connectWallet} >Connect</button>} 
            </div>
        </div>
    )
}


export default Navbar
