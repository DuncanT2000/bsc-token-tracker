import React, {useEffect} from 'react'
import '../index.css'


const SwapTable =  (props) => {


    useEffect(()=>{
        console.log("New Swaps founds")
    },[props.swaps])

    if (props.swaps === undefined || props.tokenDetails == undefined) {
        return <p>Loading Swaps...</p>
    }

    if (props.swaps === []) {
        return(<div><p>No Swaps Found!</p></div> )    
    
    }else{

        const decimal = `1${"0".repeat(props.tokenDetails.tokenDecimal)}`

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

             const amount = swapType =='BUY' ? parseFloat(item.amount0Out / parseFloat(decimal)) : parseFloat(item.amount0In / parseFloat(decimal))
             const amountBNB = swapType =='BUY' ? parseFloat(item.amount1In / 1000000000000000000) : parseFloat(item.amount1Out / 1000000000000000000)
             const amountPPT =  (amountBNB * props.bnbPrice) / amount 
             const txURL = `https://bscscan.com/tx/${item.txHash}`
             let swaptimed = new Date(0) 
             swaptimed.setUTCSeconds(item.timestamp);
              const swaptime = `${swaptimed.getHours() < 10? "0" + swaptimed.getHours(): swaptimed.getHours()}:${swaptimed.getMinutes() < 10? "0" + swaptimed.getMinutes(): swaptimed.getMinutes()}:${swaptimed.getSeconds() < 10? "0" + swaptimed.getSeconds(): swaptimed.getSeconds()}`

            return (<tr key={item.txHash + i} className={'swap-table-row'} >
            <td>{swaptime}</td>
           <td>{swapType}</td>
           <td>{parseInt(amount.toFixed(4)).toLocaleString()}</td>
           <td>${(amountBNB * props.bnbPrice).toPrecision(5)}</td>
           <td>{amountBNB.toFixed(4)}</td>
           <td>{amountPPT < 0.00000 ? amountPPT.toFixed(4): amountPPT.toFixed(props.tokenDetails.tokenDecimal)}</td>
           <td><a href={txURL} target="_blank"> <p>Check on BSC</p></a></td>
         </tr>
       )

        })}  
        </tbody>
        </table>
    </div>)

    }



    

    
}


export default SwapTable
