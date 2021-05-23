import React, {useContext, useEffect, useState} from 'react'
import {Web3Context} from './Contexts/Web3Context'
import {LSContext} from './Contexts/LSContext'
import {useQuery, gql} from '@apollo/client'
import {GET_WALLET_TOKEN} from './Queries'
import { Link } from 'react-router-dom'
import { MdDelete, MdFavoriteBorder, MdFavorite } from "react-icons/md";


const WalletTracker = () => {

    const web3con = useContext(Web3Context)
    const LSCon = useContext(LSContext)
    const [isLoading, setisLoading] = useState(true);

    const web3 = web3con.web3


        const {error,loading,data, refetch} = useQuery(GET_WALLET_TOKEN,{
        variables:{
            "network": "bsc",
            "address": web3con.account != null ?  web3con.account  : ''
          }
    })

    useEffect(() => {

        refetch()

        
    }, [web3con.account])

    useEffect(() => {

        if (typeof data == 'object') {
            setisLoading(false)
            console.log(typeof data.ethereum != 'undefined' ? data.ethereum.address[0] : 'undefined')
        }
        
        

    }, [data])

    const deleteToken = (e) => {
        if( e.target.parentNode.parentNode.id == ""){
            return
        }
        LSCon.setdeleted([... LSCon.deleted,e.target.parentNode.parentNode.id]) 
    }

    const favouriteToken = (e) => {
        if( e.target.parentNode.parentNode.id == ""){
            return
        }
        LSCon.setfavourite([... LSCon.favourite,e.target.parentNode.parentNode.id])
    }

    const unfavouriteToken = (e) => {
        console.log(e.target.parentNode.parentNode.id);
        const removedToken = LSCon.favourite.filter((token)=>{
            return token.toUpperCase() != e.target.parentNode.parentNode.id.toUpperCase() || token == ""
        }) 
        LSCon.setfavourite([...removedToken])
    }

    const restoreWallet = () => {
        LSCon.setdeleted([])
    }

    const updateTokensInWallet = () => {
        refetch()
    }

    return (
        <div style={{background:'#163F56'}}>
           { web3con.isWalletConnect == false ? 
           <p>Wallet is not connected!</p>
           : <div style={{marginTop:'10px'}}> 
               <button onClick={restoreWallet}>Restore</button>
               <button onClick={updateTokensInWallet}>Load new Tokens</button>
               { loading ? <p>Loading...</p> : <></>}
                {error ? <p>Error Collecting Wallet Data...</p> : <></> }
                 { typeof data == 'object' && !isLoading ? data.ethereum.address[0].balances.map((token)=>{
                   
                   const tokenAddress = token.currency.address == '-' ? "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c" : token.currency.address
                   
                   if(LSCon.deleted.includes(tokenAddress)){

                   }else{
                       return (<div id={tokenAddress} key={tokenAddress} style={{display: 'flex', flexDirection:'row', justifyContent: 'center', alignItems: 'center'}}> <Link style={{color: 'white',}} to={`./${tokenAddress}`}> <div>
                     <p key={token.currency.symbol}>{token.currency.symbol} - {token.value.toPrecision(8)}</p> 
                     </div></Link> 
                     {LSCon.favourite.includes(tokenAddress) ? <MdFavorite style={{ marginLeft:'10px',  color: "red", fontSize: "1.5em" }} onClick={unfavouriteToken} /> : <MdFavoriteBorder style={{marginLeft:'10px', color: "white", fontSize: "1.5em" }} onClick={favouriteToken} />} 
                     <MdDelete  style={{ marginLeft:'10px', color: "white", fontSize: "1.5em" }} 
                     onClick={deleteToken} /> </div>)
                   }

                   
                 }) : <p>No Tokens Found!</p>
                //data.ethereum.address[0].balances.map((token)=>{console.log(token)}) 

                 }         
                          </div>

           }
        </div>
    )
    
    


    
}

export default WalletTracker
