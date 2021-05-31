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
    
    const [bnbPrice, setbnbPrice] = useState(0)

    const ethEnabled = async () => {
      
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
        if(typeof accounts[0] == 'string'){
          if(window.ethereum.chainId == '0x38'){
          setisWalletConnect(true)
          setAccount(window.ethereum.selectedAddress)
          }else{
            setisWalletConnect(false)
          }
          
          window.ethereum.on('chainChanged', (chainId) => {
            if(chainId == '0x38'){
              window.location.reload();
            }else{
              setisWalletConnect(false)
            }
            
          });
          window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length > 0) {
              setAccount(accounts[0])
            }else{
              setisWalletConnect(false)
              setAccount(null)
            }
            
            
          });
          window.ethereum.on('disconnect', () => {
            setisWalletConnect(false)
            
          })

          window.ethereum.on('message',  (msg) => {
              console.log(msg);
            
            
          })

        }
        else{
          setisWalletConnect(false)
        }
      }else{
        setisWalletConnect(false)
      }


      }

      useEffect(() => {
        ethEnabled()
      }, []);

      
    return (
        <Web3Context.Provider 
        value={{web3,
        multicall,
        ethEnabled, 
        isWalletConnect, 
        setisWalletConnect, 
        account,
        bnbPrice,
        setbnbPrice
        }}>
            {children}
        </Web3Context.Provider>
    )
}

