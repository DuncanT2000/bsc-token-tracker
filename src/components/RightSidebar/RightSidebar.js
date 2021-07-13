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

            <TokenInfoItem
            TokenInfoItemHeader="BSC Scan Links"
            TokenInfoItemValue={
            <div>
                <a 
                href={`https://bscscan.com/token/${props.TokenDetails.tokenAddress}`}
                target="_blank"
                ><p style={{
                    color:'white'
                }}>View Transactions</p></a>
            <a 
                href={`https://bscscan.com/address/${props.TokenDetails.tokenAddress}#code`}
                target="_blank"
                ><p style={{
                    color:'white'
                }}>View Contract</p></a>
                <a 
                href={`https://bscscan.com/token/${props.TokenDetails.tokenAddress}#balances`}
                target="_blank"
                >
                    <p style={{
                    color:'white'
                }}>View Holders</p></a>
                </div>}
             />



        </div>
    )
}

export default RightSidebar
