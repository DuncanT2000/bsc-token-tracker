import React, {useContext, useEffect, useState} from 'react'
import {Web3Context} from './Contexts/Web3Context'
import {LSContext} from './Contexts/LSContext'
import {useQuery, gql} from '@apollo/client'
import {GET_WALLET_TOKEN} from './Queries'
import { Link } from 'react-router-dom'
import { MdDelete, MdFavoriteBorder, MdFavorite } from "react-icons/md";

import { LazyLoadImage } from 'react-lazy-load-image-component';


const WalletTracker = (props) => {

    const web3con = useContext(Web3Context)
    const LSCon = useContext(LSContext)
    const [isLoading, setisLoading] = useState(true);

    const runQuery = LSCon.walletInfo.length > 0 && LSCon.walletInfo[0].address == web3con.account ? true :false


    const web3 = web3con.web3


        const {error,loading,data, refetch} = useQuery(GET_WALLET_TOKEN,{
        variables:{
            "network": "bsc",
            "address": web3con.account != null ?  web3con.account  : ''
          },
          skip: runQuery
    })


    useEffect(() => {

        if (typeof data == 'object') {
            setisLoading(false)
            console.log(typeof data.ethereum != 'undefined' ? data.ethereum.address[0] : 'undefined')
            LSCon.setwalletInfo([data.ethereum.address[0]])
        }
        
        

    }, [data])

    const deleteToken = (e) => {
        if( e.target.parentNode.parentNode.id == ""){
            return
        }
        LSCon.setdeleted([... LSCon.deleted,e.target.parentNode.parentNode.id]) 
    }

    useEffect(() => {

        refetch()

        
    }, [web3con.account])
    
    const favouriteToken = (e) => {
        const tokenDetails = JSON.parse(e.target.parentNode.id);
        console.log(tokenDetails);
        if(tokenDetails['address'] == '-'){
            tokenDetails['address'] = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
        } 
        LSCon.setfavourite([... LSCon.favourite,tokenDetails])
        
    }

    const unfavouriteToken = (e) => {
        const tokenDetails = JSON.parse(e.target.parentNode.id);
        tokenDetails['address'] = tokenDetails['address'] == '-' ? "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c" : tokenDetails['address'] 
        const removedToken = LSCon.favourite.filter((token)=>{
            return token['address'].toUpperCase() != tokenDetails.address.toUpperCase() || token == ""
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
           <p style={{color:'white'}}>Wallet is not connected!</p>
           : <div style={{marginTop:'10px'}}> 
               <button onClick={restoreWallet}>Restore</button>
               <button onClick={updateTokensInWallet}>Load new Tokens</button>
            
                {error ? <p>Error Collecting Wallet Data...</p> : <></> }
                {typeof LSCon.walletInfo[0] == 'object' ? LSCon.walletInfo[0].balances.length == 0 ? <p style={{color: 'white'}}>No Tokens found!</p> :'' :''}
                 { typeof LSCon.walletInfo[0] == 'object' ? LSCon.walletInfo[0].balances.map((token)=>{
                    
                   const tokenAddress = token.currency.address == '-' ? "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c" : token.currency.address
                   
                   if(LSCon.deleted.includes(tokenAddress)){

                   }else{
                       return (<div id={tokenAddress} key={tokenAddress} style={{display: 'flex', flexDirection:'row', justifyContent: 'center', alignItems: 'center'}}>
                           <LazyLoadImage 
                            placeholder={<div></div>}
                            height={25}
                            width={25}
                            src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${web3.utils.toChecksumAddress(tokenAddress)}/logo.png` } />
                            <Link style={{marginLeft:'10px' ,color: 'white',}} to={`${props.tokenpathprefix}${tokenAddress}`}> <div>
                     <p key={token.currency.symbol}>{token.currency.symbol} - {token.value.toPrecision(8)}</p> 
                     </div></Link> 
                     {LSCon.favourite.some(function (el) { return el.address.toUpperCase() == tokenAddress.toUpperCase() }) ? 
                     <div id={JSON.stringify(token.currency)} onClick={unfavouriteToken}>
                     <MdFavorite id={JSON.stringify(token.currency)} style={{ marginLeft:'10px',  color: "red", fontSize: "1.5em" }} />
                     </div> :
                     <div id={JSON.stringify(token.currency)} onClick={favouriteToken}> 
                     <MdFavoriteBorder id={JSON.stringify(token.currency)} style={{marginLeft:'10px', color: "white", fontSize: "1.5em" }} /></div>} 
                     <MdDelete  style={{ marginLeft:'10px', color: "white", fontSize: "1.5em" }} 
                     onClick={deleteToken} /> </div>)
                   }
                 }) : <p>No Tokens Found!</p>
                
                 }         
                          </div>

           }
        </div>
    )
    
    


    
}

export default WalletTracker
