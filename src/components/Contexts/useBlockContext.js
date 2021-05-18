
import React, {createContext, useContext, useState, useEffect} from 'react'
import {Web3Context} from './Web3Context'

const pollingBlockInterval = 3000 //4 Seconds
const pollingBalanceInterval = 5000

export const BlockContext = createContext(null)

export const BlockContextProvider = ({children}) => {

    const [LatestBlock, setLatestBlock] = useState(0)

    const web3Con = useContext(Web3Context)
    const web3 = web3Con.web3


    const BlockListner = async ()=>{
       const bn = await web3.eth.getBlock('latest');
       
       setLatestBlock(bn)
    }



    useEffect(async () => {

        BlockListner()
        const addBlockListner = setInterval(() => {
            BlockListner()
    
        }, pollingBlockInterval);
        return ()=>{ clearInterval(addBlockListner) }
    }, [])

    return (
        <BlockContext.Provider value={{
            LatestBlock, pollingBlockInterval, pollingBalanceInterval
        }}>
            {children}
        </BlockContext.Provider>
    )
}

