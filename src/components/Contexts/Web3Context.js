import React, {createContext, useState, useEffect} from 'react'
import Web3 from 'web3';
import {
    Multicall,
    ContractCallContext,
    ContractCallResults,
    
  } from 'ethereum-multicall';


let web3 = new Web3('https://bsc-dataseed1.defibit.io/');



const multicall = new Multicall({ web3Instance: web3 });
export const Web3Context = createContext(0)



export const Web3ContextProvider = ({children}) => {

    const [isWalletConnect, setisWalletConnect] = useState(false)
    const [account, setAccount] = useState(null)
    
    const ethEnabled = async () => {
      
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
        if(typeof accounts[0] == 'string'){
          setisWalletConnect(true)
          setAccount(window.ethereum.selectedAddress)
        }else{setisWalletConnect(false)}
      }else{
        setisWalletConnect(false)
      }


      }

      useEffect(() => {
        ethEnabled()
      }, []);

    return (
        <Web3Context.Provider value={{web3,multicall,ethEnabled, isWalletConnect, setisWalletConnect, account}}>
            {children}
        </Web3Context.Provider>
    )
}

