import React, {useEffect,useState, useContext} from 'react'

import CircularProgress from '@material-ui/core/CircularProgress';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {Web3Context} from './Contexts/Web3Context.js'
import {LSContext} from './Contexts/LSContext.js'
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";

import { Link } from 'react-router-dom'
const TokenInfoBar = (props) => {

    const tokenInfoWeb3Context = useContext(Web3Context)
    const tokenInfoLSContext = useContext(LSContext)
    const web3 = tokenInfoWeb3Context.web3
    const [isLoading, setisLoading] = useState(true)

    useEffect(() => {
        setisLoading(true)
    }, [props.tokenAddress])

    useEffect(() => {
        Object.keys(props.tokenDetails).length > 0 ? setisLoading(false) : setisLoading(true)
    }, [props.tokenDetails])

    const FavouriteToken = (e)=> {

      const parsedTokenDetails = JSON.parse(e.target.id)

      console.log(parsedTokenDetails);

      const tokenDetails = {
        'name': parsedTokenDetails.TokenName,
        'symbol': parsedTokenDetails.TokenSymbol,
        'address':parsedTokenDetails.tokenAddress

      }
      console.log();

      tokenInfoLSContext.setfavourite([... tokenInfoLSContext.favourite,tokenDetails])
    }

    const unfavouriteToken = (e) => {
      const tokenDetails = JSON.parse(e.target.parentNode.id)
      const removedToken = tokenInfoLSContext.favourite.filter((token)=>{
          return token['address'].toUpperCase() != tokenDetails.tokenAddress.toUpperCase() || token == ""
      }) 
      tokenInfoLSContext.setfavourite([...removedToken])
  }


    return ( 
        <div>
        <div style={{display:'flex',flexDirection:'row', flexWrap:'wrap',  alignItems: 'center'}}>
         <div style={{display:'flex',flexDirection:'row', justifyContent: 'space-evenly', alignItems: 'center'}}>
          <div style={{display:'flex', alignItems:'center', marginRight:5}}>
            <LazyLoadImage 
            placeholder={<div></div>}
            height={50}
            width={50}
            src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${web3.utils.toChecksumAddress(props.tokenAddress)}/logo.png` } />
          </div>
          <div style={{ 
            marginRight:40}}> 
            <p>Token: </p>
            <p>{!isLoading ? props.tokenDetails.TokenName : 
            <CircularProgress color={'white'} size={20} disableShrink />}</p>
          </div>
          <div style={{ marginRight:40}}> 
            <p>Symbol: </p>
            <p>{!isLoading ?  props.tokenDetails.TokenSymbol: 
            <CircularProgress color={'white'} size={20} disableShrink />}</p>
          </div>
          <div style={{marginRight:40}}> 
            <p>Total Supply:</p>
            <p> {!isLoading ? parseInt(props.tokenDetails.TokenSupply / `1${"0".repeat(props.tokenDetails.TokenDecimals)}`).toLocaleString(): 
            <CircularProgress color={'white'} size={20} disableShrink />} </p>
          </div>
          <div style={{marginRight:40}}>
          <p>Market Cap: </p>
          <p> {!isLoading ? '$'+parseFloat(props.tokenDetails.tokenMC).toLocaleString(): 
          <CircularProgress color={'white'} size={20} disableShrink />} </p>
          </div>
          <div style={{marginRight:40}}>
         
          <p> {!isLoading ? tokenInfoLSContext.favourite.some(function (el) { return el.address.toUpperCase() == props.tokenAddress.toUpperCase() }) 
          ?  <MdFavorite onClick={unfavouriteToken} id={JSON.stringify({...props.tokenDetails})}  style={{ marginLeft:'10px',  color: "red", fontSize: "1.5em" }} />
          : <MdFavoriteBorder id={JSON.stringify({...props.tokenDetails})} 
          onClick={FavouriteToken}  
          style={{marginLeft:'10px',  color: "white", fontSize: "1.5em" }} />: 
          <CircularProgress color={'white'} size={20} disableShrink />} </p>
          </div>
          
          </div>
          <div style={{display:'flex',flexDirection:'row', justifyContent: 'space-evenly',alignItems: 'center'}}>

              <div style={{display:'flex',flexDirection:'row', minWidth:'100px' , width: 'max-content',justifyContent: 'space-evenly'}}>
              <a target="_blank" href={``} > 
              <LazyLoadImage 
                width={30}
                height={30}
                src={'../twitter.png'}/>
             </a>
                
             <a target="_blank" href={``} > 
              <LazyLoadImage 
                width={30}
                height={30}
                src={'../telegram.png'}/>
             </a>

             <a target="_blank" href={``} > 
              <LazyLoadImage 
                width={30}
                height={30}
                src={'../discord.png'}/>
             </a>
             <a target="_blank" href={``} > 
              <LazyLoadImage 
                width={30}
                height={30}
                src={'../website.png'}/>
             </a>

              </div>


      <div style={{display:'flex',flexDirection:'row'}} >

  
             <a target="_blank" style={{height:'30%',
              background:'rgba(50, 130, 184, 0.75)',
              color:'white', 
              borderRadius:'12px',  padding:'12px 25px',
              border:'0px solid', margin:'0px 0px 0px 10px',
              textDecoration: 'none' }} 
              href={`https://exchange.pancakeswap.finance/#/swap?outputCurrency=${props.tokenAddress}`} > 
             <p style={{marginBlockStart: '0',marginBlockEnd: '0'}}>Trade</p></a>
              
             <a target="_blank" style={{height:'30%',
              background:'rgba(50, 130, 184, 0.75)',
              color:'white', 
              borderRadius:'12px',  padding:'12px 25px',
              border:'0px solid', margin:'0px 0px 0px 10px',
              textDecoration: 'none' }} 
              href={`https://bscscan.com/address/${props.tokenAddress}`} > 
             <p style={{marginBlockStart: '0',marginBlockEnd: '0'}}>BSC Scan</p></a>


      </div>
      </div>
      </div>



      </div>
    
    )
}

export default TokenInfoBar
