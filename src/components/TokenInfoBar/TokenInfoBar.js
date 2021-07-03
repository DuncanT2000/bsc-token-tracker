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

         <div  style={{marginLeft:'1vw', width:'100%',display:'flex',flexDirection:'row', 
          alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap'}}>
          
          <div id="tokenInfoContainer" className={props.displaySideBar ? 'small-font' : 'large-font'}>
            <img id="token-icon"
            src={ web3.utils.isAddress(props.tokenAddress) ? `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${web3.utils.toChecksumAddress(props.tokenAddress)}/logo.png` : '' } />
          </div>
          <TokenInfoBarItem title="Name" 
          isLoading={isLoading} 
          content={props.tokenDetails.TokenName}
          displaySideBar={props.displaySideBar}/>
          <TokenInfoBarItem title="Symbol" isLoading={isLoading} 
          content={props.tokenDetails.TokenSymbol} 
          displaySideBar={props.displaySideBar} />
          <TokenInfoBarItem title="Price" isLoading={isLoading} 
          content={parseFloat(props.tokenDetails.TokenPrice).toFixed(12)} 
          displaySideBar={props.displaySideBar}/>
          <TokenInfoBarItem title={`Token Supply`} isLoading={isLoading} 
          isNumber={true} content={parseInt(props.tokenDetails.TokenSupply / `1${"0".repeat(props.tokenDetails.TokenDecimals)}`)}
          displaySideBar={props.displaySideBar} />
          <TokenInfoBarItem title={`Market Cap`} isLoading={isLoading} isNumber={true} isMoney={true} content={parseInt(props.tokenDetails.TokenMC)} 
          displaySideBar={props.displaySideBar}/>

          <div id="tokenInfoContainer" >
          <p> {!isLoading ? tokenInfoLSContext.favourite.some(function (el) { return el.address.toUpperCase() == props.tokenAddress.toUpperCase() }) 
          ?  <MdFavorite className="MdFavorite1" 
          onClick={unfavouriteToken} 
          id={JSON.stringify({...props.tokenDetails})}  
          />
          : <MdFavoriteBorder className="MdFavoriteBorder"
           id={JSON.stringify({...props.tokenDetails})} 
          onClick={FavouriteToken}  
         />: 
          <CircularProgress color='white' size={20} disableShrink />} </p>
          </div>
                    
                    
         
          
            <div id="tokenInfoContainer">
              {typeof props.tokenDetails.TSDetailsJSON === 'undefined' ?
              <> </>
             : props.tokenDetails.TSDetailsJSON.website == '' ? <></> : 
             <a target="_blank" href={props.tokenDetails.TSDetailsJSON.website}> 
             <MdLaunch  id="mdLaunchIcon" />
             </a>
                  }
             
              </div>

            <div id="token-Info-Btn-container" >
              <TokenInfoBarButton text="Trade" 
              displaySideBar={props.displaySideBar}
              url={`https://exchange.pancakeswap.finance/#/swap?outputCurrency=${props.tokenAddress}`} />
              <TokenInfoBarButton text="BSC Scan" 
              displaySideBar={props.displaySideBar}
              url={`https://bscscan.com/address/${props.tokenAddress}`} />
              </div>
          </div>
          
           
    )
}



export default TokenInfoBar
