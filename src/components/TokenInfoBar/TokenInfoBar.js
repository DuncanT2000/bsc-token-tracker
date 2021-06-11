import React, {useEffect,useState, useContext, useRef} from 'react'

import CircularProgress from '@material-ui/core/CircularProgress';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {Web3Context} from '../Contexts/Web3Context.js'
import {LSContext} from '../Contexts/LSContext.js'
import { MdFavoriteBorder, MdFavorite,MdLaunch } from "react-icons/md";
import TokenInfoBarItem from './TokenInfoBarItem.js';
import TokenInfoBarButton from './TokenInfoBarButton';
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



         <div style={{width:'100%',display:'flex', flex:1,flexDirection:'row', 
          alignItems: 'center',marginLeft:'2vw'}}>
          
          <div style={styles.tokenInfoContainer}>
            <LazyLoadImage 
            placeholder={<div></div>}
            height={50}
            width={50}
            src={ web3.utils.isAddress(props.tokenAddress) ? `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${web3.utils.toChecksumAddress(props.tokenAddress)}/logo.png` : '' } />
          </div>
          <TokenInfoBarItem title="Name" isLoading={isLoading} content={props.tokenDetails.TokenName} />
          <TokenInfoBarItem title="Symbol" isLoading={isLoading} content={props.tokenDetails.TokenSymbol} />
          <TokenInfoBarItem title="Price" isLoading={isLoading} content={parseFloat(props.tokenDetails.TokenPrice).toFixed(12)} />
          <TokenInfoBarItem title={`Token Supply`} isLoading={isLoading} isNumber={true} content={parseInt(props.tokenDetails.TokenSupply / `1${"0".repeat(props.tokenDetails.TokenDecimals)}`)} />
          <TokenInfoBarItem title={`Market Cap`} isLoading={isLoading} isNumber={true} isMoney={true} content={parseInt(props.tokenDetails.TokenMC)} />

          <div style={styles.tokenInfoContainer}>
          <p> {!isLoading ? tokenInfoLSContext.favourite.some(function (el) { return el.address.toUpperCase() == props.tokenAddress.toUpperCase() }) 
          ?  <MdFavorite onClick={unfavouriteToken} id={JSON.stringify({...props.tokenDetails})}  style={{ marginLeft:'10px',  color: "red", fontSize: "1.5em" }} />
          : <MdFavoriteBorder id={JSON.stringify({...props.tokenDetails})} 
          onClick={FavouriteToken}  
          style={{marginLeft:'10px',  color: "white", fontSize: "1.5em" }} />: 
          <CircularProgress color='white' size={20} disableShrink />} </p>
          </div>
                    
                    
         
          
            <div>
              {typeof props.tokenDetails.TSDetailsJSON === 'undefined' ?
              <> </>
             : props.tokenDetails.TSDetailsJSON.website == '' ? <></> : <a target="_blank" href={props.tokenDetails.TSDetailsJSON.website} > 
             <MdLaunch  style={{color: "white", fontSize: "1.3em" }}/>
             </a>
                  }
             
              </div>

            <div style={{display:"inline", width:'100%'}} >
              <TokenInfoBarButton text="Trade" 
              url={`https://exchange.pancakeswap.finance/#/swap?outputCurrency=${props.tokenAddress}`} />
              <TokenInfoBarButton text="BSC Scan" 
              url={`https://bscscan.com/address/${props.tokenAddress}`} />
              </div>
          </div>
          
           
    )
}


const styles = {
  tokenInfoContainer:{
    marginRight:'2%'
  }
}

export default TokenInfoBar
