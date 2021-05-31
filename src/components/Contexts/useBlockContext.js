
import React, {createContext, useState, useEffect} from 'react'
import Web3 from 'web3'

const pollingBlockInterval = 3000 //4 Seconds
const pollingBalanceInterval = 5000

const web3 = new Web3('https://bsc-dataseed1.defibit.io/')

export const BlockContext = createContext(null)

export const BlockContextProvider = ({children}) => {

    const [LatestBlock, setLatestBlock] = useState(0)




    const BlockListner = async ()=>{
       const bn = await web3.eth.getBlock('latest');
       
       setLatestBlock(bn)
    }



    useEffect( () => {
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

