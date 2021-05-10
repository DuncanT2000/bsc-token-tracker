import React, {useEffect} from 'react'
import { fromUnixTime, set } from 'date-fns'
import '../index.css'


const SwapTable =  (props) => {

    console.log(props.bnbPrice);

    if (props.swaps === undefined) {
        return <p>Loading Swaps...</p>
    }

    if (props.swaps == []) {
        return <p>No Swaps Found!</p>
    }




    return(  <div>
        <table key="swapTable">
        <tbody key="swapHeadings">
            <th key="swapHeadingsTS">TimeStamp</th>
            <th key="swapHeadingsType">Swap Type</th>
            <th key="swapHeadingsAmount">Amount</th>
            <th key="swapHeadingsAmountUSD">Amount(USD)</th>
            <th key="swapHeadingsAmountETH">Amount(BNB)</th>
            <th key="swapHeadingsPPT">Price per Token</th>

            <th key="swapHeadingsTxId">Tx ID</th>
        {props.swaps.map((item, i) =>{
            let swapType;
            
            if (item.amount1Out == 0 ) {
                swapType =  'BUY'
            }else {
                swapType =  'SELL'
            }

             const amount = swapType =='BUY' ? parseFloat(item.amount0Out / 100000000) : parseFloat(item.amount0In / 100000000)
             const amountBNB = swapType =='BUY' ? parseFloat(item.amount1In / 1000000000000000000) : parseFloat(item.amount1Out / 1000000000000000000)
             const amountPPT =  props.bnbPrice * (amountBNB/amount) 
             const txURL = `https://bscscan.com/tx/${item.txHash}`
            return (<tr key={item.txHash + i} className={'swap-table-row'} >
            <td>{item.timestamp}</td>
           <td>{swapType}</td>
           <td>{amount.toFixed(4)}</td>
           <td>${(amountBNB * props.bnbPrice).toPrecision(5)}</td>
           <td>{amountBNB.toFixed(4)}</td>
           <td>{amountPPT.toFixed(4)}</td>
           <td><a href={txURL} target="_blank"> <p>Check on BSC</p></a></td>
         </tr>
       )

        })}  
        </tbody>
        </table>
    </div>)

    
}


export default SwapTable
