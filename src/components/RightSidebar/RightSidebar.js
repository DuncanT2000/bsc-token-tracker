import React,{useEffect} from 'react'

import TokenInfoItem from './TokenInfoItem'

import './RightSideBar.css'

const RightSidebar = (props) => {

    useEffect(() => {
        console.log(props.TokenDetails);
    }, [props.TokenDetails.tokenAddress])

    return (
        <div id="RightSBContainer" >
            <h3>Token Information</h3>

            <TokenInfoItem
            TokenInfoItemHeader="Market Cap"
            TokenInfoItemValue={`$`+Number(Math.floor(props.TokenDetails.TokenMC)).toLocaleString()}
             />

             <TokenInfoItem
            TokenInfoItemHeader="Total Supply"
            TokenInfoItemValue={Number(Math.floor(props.TokenDetails.TokenSupply / `1${"0".repeat(props.TokenDetails.TokenDecimals)}`)).toLocaleString()}
             />



        </div>
    )
}

export default RightSidebar
