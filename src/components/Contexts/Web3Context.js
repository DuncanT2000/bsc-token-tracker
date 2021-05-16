import React, {createContext, useState} from 'react'
import Web3 from 'web3';
import {
    Multicall,
    ContractCallContext,
    ContractCallResults,
    
  } from 'ethereum-multicall';
  

const web3 = new Web3('https://bsc-dataseed1.defibit.io/');
const multicall = new Multicall({ web3Instance: web3 });
export const Web3Context = createContext(0)



export const Web3ContextProvider = ({children}) => {

    const [isWalletConnect, setisWalletConnect] = useState(false)
    console.log(window.ethereum);
    const ethEnabled = async () => {
        
        if (window.ethereum && window.ethereum.networkVersion == "56") {
          await window.ethereum.send('eth_requestAccounts');
          setisWalletConnect(true)
        }
        setisWalletConnect(false);
      }


    return (
        <Web3Context.Provider value={{web3,multicall,ethEnabled, isWalletConnect}}>
            {children}
        </Web3Context.Provider>
    )
}

