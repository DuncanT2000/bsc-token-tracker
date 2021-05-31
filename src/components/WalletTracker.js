import React, {useContext, useEffect, useState} from 'react'
import {Web3Context} from './Contexts/Web3Context'
import {LSContext} from './Contexts/LSContext'
import {useQuery} from '@apollo/client'
import {GET_WALLET_TOKEN} from './Queries'
import { Link } from 'react-router-dom'
import { MdDelete, MdFavoriteBorder, MdFavorite } from "react-icons/md";

import { LazyLoadImage } from 'react-lazy-load-image-component';


const WalletTracker = (props) => {

    const web3con = useContext(Web3Context)
    const LSCon = useContext(LSContext)
    const [trackwalletContainerStatus, settrackwalletContainerStatus] = useState(false)

    const runQuery = 
    LSCon.walletInfo.length > 0  && 
    LSCon.walletInfo[0].address == web3con.account ? true :false


    const web3 = web3con.web3

    const walletAddress = LSCon.trackWalletAddress != null ? LSCon.trackWalletAddress : web3con.account != null ?  web3con.account : ''


        const {error,loading,data, refetch} = useQuery(GET_WALLET_TOKEN,{
        variables:{
            "network": "bsc",
            "address": walletAddress
          },
          skip: runQuery
    })


    useEffect(() => {

        if (typeof data == 'object') {
            if (LSCon.trackWalletAddress == null) {
                LSCon.setwalletInfo([data.ethereum.address[0]])
            }
            if (LSCon.trackWalletAddress != null) {
                LSCon.settrackWalletInfo([data.ethereum.address[0]])
            }
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

    const opentrackWallet = () => {
        settrackwalletContainerStatus(s => !s)
        console.log(trackwalletContainerStatus);
    }
    const removetrackWallet = () => {
        LSCon.settrackWalletAddress(null)
        
    }

    const settrackWallet = (e) => {
        if (web3.utils.isAddress(e.target.children[0].value)){
            LSCon.settrackWalletAddress(e.target.children[0].value)
            settrackwalletContainerStatus(s => !s)
            LSCon.setwalletInfo([])
        }
    }


    return (
        <div style={{background:'#163F56'}}>
           { web3con.isWalletConnect == false 
           && LSCon.trackWalletAddress == null
            ? 
           <p style={{color:'white'}}>Wallet is not connected!</p>
           : 
           <div style={{marginTop:'10px'}}> 
           <div style={{display:'flex', justifyContent:'space-evenly'}}>
                {
                LSCon.trackWalletAddress == null ? 
                <button style={{margin:'0 5px'}} onClick={opentrackWallet}>Track Wallet</button> 
                : 
                <button style={{margin:'0 5px'}} onClick={removetrackWallet}>Remove Wallet</button>
                } 
               
               <button style={{margin:'0 5px'}} onClick={restoreWallet}>Restore</button>
               <button style={{margin:'0 5px'}} onClick={updateTokensInWallet}>Load new Tokens</button>
            </div>
            {trackwalletContainerStatus ? <div style={{margin:'10px 5px'}}>
                <form onSubmit={(e)=>{e.preventDefault() 
                    settrackWallet(e) }}>
                <input placeholder="Enter Wallet Address" 
                style={{margin:'0 5px 0 0'}} />
                <button type="submit" >Track</button>
                </form>
            </div> : <></>}
                {error ? <p>Error Collecting Wallet Data...</p> : <></> }
                {typeof LSCon.walletInfo[0] == 'object' ? LSCon.walletInfo[0].balances.length == 0 ? <p style={{color: 'white'}}>No Tokens found!</p> :'' :''}
                {typeof LSCon.walletInfo[0] == 'object' ? LSCon.walletInfo[0].balances.map((token)=>{
                    
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
                 }) : typeof LSCon.trackWalletInfo[0] == 'object' ? LSCon.trackWalletInfo[0].balances.map((token)=>{
                    
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
                  }) : <p>No Track Found!</p>
                
                 }   

                          </div>

           }
        </div>
    )
    
    


    
}

export default WalletTracker
