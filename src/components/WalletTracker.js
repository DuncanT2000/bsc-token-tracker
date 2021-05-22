import React, {useContext, useEffect, useState} from 'react'
import {Web3Context} from './Contexts/Web3Context'
import {useQuery, gql} from '@apollo/client'
import {GET_WALLET_TOKEN} from './Queries'
import { Link } from 'react-router-dom'

const WalletTracker = () => {

    const web3con = useContext(Web3Context)
    
    const [isLoading, setisLoading] = useState(true);

    const web3 = web3con.web3


        const {error,loading,data, refetch} = useQuery(GET_WALLET_TOKEN,{
        variables:{
            "network": "bsc",
            "address": window.ethereum.selectedAddress != undefined ?  window.ethereum.selectedAddress  : ''
          }
    })

    useEffect(() => {

        refetch()

        
    }, [window.ethereum.selectedAddress])

    useEffect(() => {

        if (typeof data == 'object') {
            setisLoading(false)
        }
        
    }, [data])

    return (
        <div>
           { web3con.isWalletConnect == false ? 
           <p>Wallet is not connected!</p>
           : <div> 
               { loading ? <p>Loading...</p> : <></>}
                {error ? <p>Error Collecting Wallet Data...</p> : <></> }
                 { typeof data == 'object' && !isLoading ? data.ethereum.address[0].balances.map((token)=>{
                   const tokenAddress = token.currency.address == '-' ? "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c" : token.currency.address
                     return (<Link to={`./${tokenAddress}`}> <div>
                     <p key={token.currency.symbol}>{token.currency.symbol} - {token.value.toPrecision(8)}</p> 
                     </div></Link>)
                 }) : <p>No Tokens Found!</p>
                //data.ethereum.address[0].balances.map((token)=>{console.log(token)}) 

                 }         
                          </div>

           }
        </div>
    )
    
    


    
}

export default WalletTracker
