import React, {useEffect,useState, useContext, useRef} from 'react'

import CircularProgress from '@material-ui/core/CircularProgress';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {Web3Context} from './Contexts/Web3Context.js'
import {LSContext} from './Contexts/LSContext.js'
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import {Popover, Container} from '@material-ui/core';
import { Link } from 'react-router-dom'
import MouseOverIcon from './MouseOverIcon'
const TokenInfoBar = (props) => {

  const isMounted = useRef(true)

    const tokenInfoWeb3Context = useContext(Web3Context)
    const tokenInfoLSContext = useContext(LSContext)
    const web3 = tokenInfoWeb3Context.web3
    const [isLoading, setisLoading] = useState(true)

    useEffect(() => {
      return ()=>{
        isMounted.current = false
      }
  }, [])

    useEffect(() => {
      if (isMounted.current) {
        setisLoading(true)
      }
        
    }, [props.tokenAddress])

    useEffect(() => {
      if (isMounted.current) {
        Object.keys(props.tokenDetails).length > 0 ? setisLoading(false) : setisLoading(true)
      }
        
    }, [props.tokenDetails])

    const FavouriteToken = (e)=> {

      const parsedTokenDetails = JSON.parse(e.target.id)

      console.log(parsedTokenDetails);

      const tokenDetails = {
        'name': parsedTokenDetails.TokenName,
        'symbol': parsedTokenDetails.TokenSymbol,
        'address':parsedTokenDetails.tokenAddress

      }

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
      <Container>


         <div style={{width:'100%',display:'flex', flex:1,flexDirection:'row', 
          alignItems: 'center',marginLeft:'2vw', width:'fit-content'}}>
          
          <div style={styles.tokenInfoContainer}>
            <LazyLoadImage 
            placeholder={<div></div>}
            height={50}
            width={50}
            src={ web3.utils.isAddress(props.tokenAddress) ? `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${web3.utils.toChecksumAddress(props.tokenAddress)}/logo.png` : '' } />
          </div>
          <div style={styles.tokenInfoContainer}> 
            <p>Token: </p>
            <p>{!isLoading ? props.tokenDetails.TokenName : 
            <CircularProgress color='white' size={20} disableShrink />}</p>
          </div>
          <div style={styles.tokenInfoContainer}> 
            <p>Symbol: </p>
            <p>{!isLoading ?  props.tokenDetails.TokenSymbol: 
            <CircularProgress color={'white'} size={20} disableShrink />}</p>
          </div>
          <div style={styles.tokenInfoContainer}> 
            <p>Price: </p>
            <p>{!isLoading ?  
            parseFloat(props.tokenDetails.TokenPrice).toFixed(12): 
            <CircularProgress color={'white'} size={20} disableShrink />}</p>
          </div> 
          <div style={styles.tokenInfoContainer}> 
            <p>Total Supply: {!isLoading ? <MouseOverIcon number={props.tokenDetails.TokenSupply / `1${"0".repeat(props.tokenDetails.TokenDecimals)}`} /> : 
            <CircularProgress color='white' size={20} disableShrink />} </p>
            <p> {!isLoading ? parseInt(props.tokenDetails.TokenSupply / `1${"0".repeat(props.tokenDetails.TokenDecimals)}`).toLocaleString(): 
            <CircularProgress color='white' size={20} disableShrink />} </p>
          </div>
          <div style={styles.tokenInfoContainer}>
          <p>Market Cap: {!isLoading ? <MouseOverIcon number={parseFloat(props.tokenDetails.TokenMC)} /> : 
            <CircularProgress color='white' size={20} disableShrink />} </p>
          <p> {!isLoading ? '$'+parseInt(props.tokenDetails.TokenMC).toLocaleString(): 
          <CircularProgress color='white' size={20} disableShrink />} </p>
          </div>
          <div style={styles.tokenInfoContainer}>
         
          <p> {!isLoading ? tokenInfoLSContext.favourite.some(function (el) { return el.address.toUpperCase() == props.tokenAddress.toUpperCase() }) 
          ?  <MdFavorite onClick={unfavouriteToken} id={JSON.stringify({...props.tokenDetails})}  style={{ marginLeft:'10px',  color: "red", fontSize: "1.5em" }} />
          : <MdFavoriteBorder id={JSON.stringify({...props.tokenDetails})} 
          onClick={FavouriteToken}  
          style={{marginLeft:'10px',  color: "white", fontSize: "1.5em" }} />: 
          <CircularProgress color='white' size={20} disableShrink />} </p>
          </div>
                    
                    
          <div style={{display:'flex',flexDirection:'row',alignItems: 'center'}}>
          
            <div style={{display:'flex',flexDirection:'row', 
              minWidth:'100px',
              }}>
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
              <a target="_blank" style={{
                height:'30%',
                background:'rgba(50, 130, 184, 0.75)',
                color:'white', 
                borderRadius:'12px',  padding:'5% 15%',
                border:'0px solid', 
                margin:'0px 0px 0px 10px',
                textDecoration: 'none' }} 
                href={`https://exchange.pancakeswap.finance/#/swap?outputCurrency=${props.tokenAddress}`} > 
              <p style={{marginBlockStart: '0',marginBlockEnd: '0'}}>Trade</p>
              </a>
              
              <a target="_blank" style={{height:'30%',
                background:'rgba(50, 130, 184, 0.75)',
                color:'white', 
                borderRadius:'12px',  
                padding:'5% 15%',
                border:'0px solid', 
                whiteSpace:'nowrap',
                margin:'0px 0px 0px 10px',
                textDecoration: 'none' }} 
                href={`https://bscscan.com/address/${props.tokenAddress}`} > 
              <p style={{marginBlockStart: '0',marginBlockEnd: '0'}}>BSC Scan</p></a>

      </div>


              
          </div>
          </div>
           
      
      
    </Container>
    )
}

const styles = {
  tokenInfoContainer:{
    marginRight:'1rem'
  }
}

export default TokenInfoBar
