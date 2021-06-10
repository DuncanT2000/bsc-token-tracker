import React, {useContext, useRef, useEffect} from 'react'
import '../index.css'
import {Web3Context} from './/Contexts/Web3Context.js'

/*
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
*/
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  AutoSizer, 
  Table, 
  Column} from 'react-virtualized'
  import 'react-virtualized/styles.css'

const SwapTable =  (props) => {


    const swapWeb3Context = useContext(Web3Context)
    const web3 = swapWeb3Context.web3




    if (typeof props.TokenDetails.lpaddress == 'undefined' 
    || props.TokenDetails.lpaddress.length == 0) {
      return(<div style={{color: 'white'}} ><p>Loading...</p></div>)
    }else{
     
      if(props.TokenDetails.tokenAddress.toUpperCase() =="0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c".toUpperCase()){
        return (
          <div style={{ 
            height: 'auto', 
            minHeight: '100%', backgroundColor:'#1B262C'}}>
            <AutoSizer>
              {({ height, width }) => (
                <Table
                  width={width}
                  height={height}
                  headerHeight={45}
                  rowHeight={60}
                  rowCount={props.swaps.filter(s=> props.TokenDetails.lpaddress.map(e=> e.address).includes(s.address)).length}
                  rowGetter={({ index }) => props.swaps[index]}
                  >
                  
                  {/* Time Column */}
                  <Column cellRenderer={(col)=>{
                  const swap = props.swaps[col.rowIndex]
                  const d = new Date(0); 
                  d.setUTCSeconds(swap.blockData.timestamp);
                  const timestamp = `${d.getHours()< 10 ? "0"+d.getHours():d.getHours()}:${d.getMinutes()< 10 ? "0"+d.getMinutes():d.getMinutes()}:${d.getSeconds()< 10 ? "0"+d.getSeconds():d.getSeconds()}`;
                  const tokenDetails = props.TokenDetails
                  const filterLPAddress = tokenDetails.lpaddress.filter((element, index, array) => { 
                    return element.address == swap.address} )

                    //0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16 BNB - BUSD
                    //0x1B96B92314C44b159149f7E0303511fB2Fc4774f BNB - BUSD

                    const logs =  swap['decodeLogs']
                    const amount0In = logs['amount0In']
                    const amount1In = logs['amount1In']
                    const amount0Out = logs['amount0Out']
                    const amount1Out = logs['amount1Out']
                    const type = amount0Out == 0 ? 'SELL' : 'BUY' 
                    
                     return <span className={type}>{timestamp}</span>
  
                  }}  disableSort={true} label="Time" width={200}
                  dataKey={'blockNumber'} />
                  
                  {/* Swap Type Column */}
  
                  <Column cellRenderer={(col)=>{
                  const swap = props.swaps[col.rowIndex]
                  const tokenDetails = props.TokenDetails
                  const filterLPAddress = tokenDetails.lpaddress.filter((element, index, array) => { 
                    return element.address == swap.address} )

                    const logs =  swap['decodeLogs']
                    const amount0In = logs['amount0In']
                    const amount1In = logs['amount1In']
                    const amount0Out = logs['amount0Out']
                    const amount1Out = logs['amount1Out']

                    const type = amount0Out == 0 ? 'SELL' : 'BUY'

                    return <span className={type}>{type}</span> 

                  }} disableSort={true}  width={300} label="Type" 
                  dataKey="logIndex" />
                  
                    {/* Token Amount Column */}
  
                  <Column 
                  cellRenderer={(col)=>{
                  const swap = props.swaps[col.rowIndex]
  
                  const tokenDetails = props.TokenDetails
                  const filterLPAddress = tokenDetails.lpaddress.filter((element, index, array) => { 
                    return element.address == swap.address} )
  
                    const logs =  swap['decodeLogs']
                    const amount0In = logs['amount0In']
                    const amount1In = logs['amount1In']
                    const amount0Out = logs['amount0Out']
                    const amount1Out = logs['amount1Out']
                    const type = amount0Out == 0 ? 'SELL' : 'BUY' 

                    const tokenAmount = type =="BUY" ? amount0Out / `1${"0".repeat(18)}` : amount0In / `1${"0".repeat(18)}`
  
                    return <span className={type}>{tokenAmount.toFixed(6)}</span> 

                  }} disableSort={true} 
                  width={300} 
                  label="Tokens" 
                  dataKey="tokensAmount" />
  
                  {/* Amount USD */}
  
                  <Column disableSort={true} 
                  cellRenderer={(col)=>{
                  const swap = props.swaps[col.rowIndex]
  
                  const tokenDetails = props.TokenDetails
                  const filterLPAddress = tokenDetails.lpaddress.filter((element, index, array) => { 
                    return element.address == swap.address} )

                    const logs =  swap['decodeLogs']
                    const amount0In = logs['amount0In']
                    const amount1In = logs['amount1In']
                    const amount0Out = logs['amount0Out']
                    const amount1Out = logs['amount1Out']

                    const type = amount0Out == 0 ? 'SELL' : 'BUY'

                    const amountUSD = type == 'SELL' ? amount1Out / `1${"0".repeat(18)}`  : amount1In / `1${"0".repeat(18)}`

                    return <span className={type}>{amountUSD.toFixed(4)}</span> 
                  
                  }} 
                  disableSort={true}  
                  width={300} 
                  label="Amount(USD)" 
                  dataKey={'logIndex'}  />               
  
  
                  {/* Amount BNB */}
  
                  <Column disableSort={true} 
                  cellRenderer={(col)=>{
                  const swap = props.swaps[col.rowIndex]
  
                  const tokenDetails = props.TokenDetails
                  const filterLPAddress = tokenDetails.lpaddress.filter((element, index, array) => { 
                    return element.address == swap.address} )
  
                    const logs =  swap['decodeLogs']
                    const amount0In = logs['amount0In']
                    const amount1In = logs['amount1In']
                    const amount0Out = logs['amount0Out']
                    const amount1Out = logs['amount1Out']
                    const type = amount0Out == 0 ? 'SELL' : 'BUY' 

                    const tokenAmount = type =="BUY" ? amount0Out / `1${"0".repeat(18)}` : amount0In / `1${"0".repeat(18)}`
  
                    return <span className={type}>{tokenAmount.toFixed(6)}</span> 

                  }} 
                  disableSort={true}  
                  width={300} 
                  label="Amount(BNB)"
                  dataKey={'removed'}  />      
                           
                  {/* Amount Per Token USD */}
  
                  <Column disableSort={true} 
                  cellRenderer={(col)=>{
                  const swap = props.swaps[col.rowIndex]
  
                  const tokenDetails = props.TokenDetails
                  const filterLPAddress = tokenDetails.lpaddress.filter((element, index, array) => { 
                    return element.address == swap.address} )

                    const logs =  swap['decodeLogs']
                    const amount0In = logs['amount0In']
                    const amount1In = logs['amount1In']
                    const amount0Out = logs['amount0Out']
                    const amount1Out = logs['amount1Out']
                    const type = amount0Out == 0 ? 'SELL' : 'BUY' 

                    const tokenAmount = type =="BUY" ? amount0Out / `1${"0".repeat(18)}` : amount0In / `1${"0".repeat(18)}`
  
                    const amountUSD = type == 'SELL' ? amount1Out / `1${"0".repeat(18)}`  : amount1In / `1${"0".repeat(18)}`

                    const PPT = amountUSD / tokenAmount 

                    return <span className={type}>{PPT.toFixed(3)}</span> 

                  
                  }} 
                  disableSort={true}  
                  width={300} 
                  label="Price/Token" 
                  dataKey={'logIndex'}  />               
  
                           
                  {/* TX id Col */}    
                  <Column 
                  cellRenderer={(col)=>{
                      const swap = props.swaps[col.rowIndex]
                        const txURL = `https://bscscan.com/tx/${swap.transactionHash}`
                        return <a style={{color:'white'}} href={txURL} target="_blank">{swap.transactionHash.substring(0,6)}</a>
                
                      }} disableSort={true}  
                  width={300} 
                  label="Tx ID" 
                  dataKey={'transactionHash'}  />   
                  
          
                </Table>
              )}
            </AutoSizer>
          </div>
        );
      }else{
        if (props.loaded) {
        
        return (
        <div style={{ 
          height: 'auto', 
          minHeight: '100%', backgroundColor:'#1B262C'}}>
          <AutoSizer>
            {({ height, width }) => (
              <Table
                width={width}
                height={height}
                headerHeight={45}
                rowHeight={60}
                rowCount={props.swaps.filter(s=> props.TokenDetails.lpaddress.map(e=> e.address).includes(s.address)).length}
                rowGetter={({ index }) => props.swaps[index]}
                >
                
                {/* Time Column */}
                <Column cellRenderer={(col)=>{
                const swap = props.swaps[col.rowIndex]
                const d = new Date(0); 
                d.setUTCSeconds(swap.blockData.timestamp);
                const timestamp = `${d.getHours()< 10 ? "0"+d.getHours():d.getHours()}:${d.getMinutes()< 10 ? "0"+d.getMinutes():d.getMinutes()}:${d.getSeconds()< 10 ? "0"+d.getSeconds():d.getSeconds()}`;
                const tokenDetails = props.TokenDetails
                const filterLPAddress = tokenDetails.lpaddress.filter((element, index, array) => { 
                  return element.address == swap.address} )

                  if(filterLPAddress.length > 0){
                                    if (filterLPAddress[0].type == 'BUSD') {

                  if (filterLPAddress[0].token0.toLowerCase() == tokenDetails.tokenAddress.toLowerCase()) {
                    const logs =  swap['decodeLogs']
                    const amount1Out = logs['amount1Out']
                    const type = amount1Out == 0 ? 'BUY' : 'SELL'
                    return <span className={type} >{timestamp}</span>
                  }

              if (filterLPAddress[0].token1.toLowerCase() == tokenDetails.tokenAddress.toLowerCase()) {
                const logs =  swap['decodeLogs']
                const amount0Out = logs['amount0Out']

                const type = amount0Out == 0 ? 'BUY' : 'SELL'

                return <span className={type} >{timestamp}</span>
              }
                }else{
                  if (filterLPAddress[0].token0.toLowerCase() == tokenDetails.tokenAddress.toLowerCase()) {
                    const logs =  swap['decodeLogs']
                    const amount1Out = logs['amount1Out']
                    const type = amount1Out == 0 ? 'BUY' : 'SELL'
                    return <span className={type} >{timestamp}</span>
                  }

              if (filterLPAddress[0].token1.toLowerCase() == tokenDetails.tokenAddress.toLowerCase()) {
                const logs =  swap['decodeLogs']
                const amount0Out = logs['amount0Out']
                const type = amount0Out == 0 ? 'BUY' : 'SELL'
                return <span className={type} >{timestamp}</span>
              }
                }
                  }




                }}  disableSort={true} label="Time" width={200}
                dataKey={'blockNumber'} />
                
                {/* Swap Type Column */}

                <Column cellRenderer={(col)=>{
                const swap = props.swaps[col.rowIndex]
                const tokenDetails = props.TokenDetails
                const filterLPAddress = tokenDetails.lpaddress.filter((element, index, array) => { 
                  return element.address == swap.address} )

                  if(filterLPAddress.length > 0){
                    if (filterLPAddress[0].type == 'BUSD') {

                  if (filterLPAddress[0].token0.toLowerCase() == tokenDetails.tokenAddress.toLowerCase()) {
                    const logs =  swap['decodeLogs']
                    const amount1Out = logs['amount1Out']
                    const type = amount1Out == 0 ? 'BUY' : 'SELL'
                    return <span className={type} >{type}</span>
                  }

              if (filterLPAddress[0].token1.toLowerCase() == tokenDetails.tokenAddress.toLowerCase()) {
                const logs =  swap['decodeLogs']
                const amount0Out = logs['amount0Out']

                const type = amount0Out == 0 ? 'BUY' : 'SELL'

                return <span className={type} >{type}</span>
              }
                }else{
                  if (filterLPAddress[0].token0.toLowerCase() == tokenDetails.tokenAddress.toLowerCase()) {
                    const logs =  swap['decodeLogs']
                    const amount1Out = logs['amount1Out']
                    const type = amount1Out == 0 ? 'BUY' : 'SELL'


                    return <span className={type} >{type}</span>
                  }

              if (filterLPAddress[0].token1.toLowerCase() == tokenDetails.tokenAddress.toLowerCase()) {
                const logs =  swap['decodeLogs']
                const amount0Out = logs['amount0Out']
                const type = amount0Out == 0 ? 'BUY' : 'SELL'
                return <span className={type} >{type}</span>
              }
                }
                  }

                

                }} disableSort={true}  width={300} label="Type" 
                dataKey="logIndex" />
                
                  {/* Token Amount Column */}

                <Column 
                cellRenderer={(col)=>{
                const swap = props.swaps[col.rowIndex]

                const tokenDetails = props.TokenDetails
                const filterLPAddress = tokenDetails.lpaddress.filter((element, index, array) => { 
                  return element.address == swap.address} )

                  if(filterLPAddress.length > 0){
                                      if (filterLPAddress[0].type == 'BUSD') {

                    if (filterLPAddress[0].token0.toLowerCase() == tokenDetails.tokenAddress.toLowerCase()) {
                      const logs =  swap['decodeLogs']
                      const amount0In = logs['amount0In']
                      const amount0Out = logs['amount0Out']

                      const amount1Out = logs['amount1Out']
                      const type = amount1Out == 0 ? 'BUY' : 'SELL'
                      const tokenAmount = type =='SELL' ? amount0In / `1${"0".repeat(props.TokenDetails.TokenDecimals)}`:  amount0Out / `1${"0".repeat(props.TokenDetails.TokenDecimals)}`

                      return (<div className={type}>
                        <p style={{fontSize:'1rem',
                            marginBlockStart: '0',
                            marginBlockEnd: '0',
                            marginInlineStart: '0',
                            marginInlineEnd: '0',
                      }}>{tokenAmount.toLocaleString()}</p>
                        <p style={{fontSize:'0.5rem',
                            marginBlockStart: '0',
                            marginBlockEnd: '0',
                            marginInlineStart: '0px',
                            marginInlineEnd: '0px',
                      }}>{tokenDetails.TokenSymbol}</p>
                        </div>)
                    }

                if (filterLPAddress[0].token1.toLowerCase() == tokenDetails.tokenAddress.toLowerCase()) {
                  const logs =  swap['decodeLogs']
                  const amount0Out = logs['amount0Out']
                  const amount1In = logs['amount1In']
                  const amount1Out = logs['amount1Out']
                  const type = amount0Out == 0 ? 'BUY' : 'SELL'
                  const tokenAmount = type =='SELL' ? amount1In / `1${"0".repeat(props.TokenDetails.TokenDecimals)}`:  amount1Out / `1${"0".repeat(props.TokenDetails.TokenDecimals)}`

                  return (<div className={type}>
                    <p style={{fontSize:'1rem',
                        marginBlockStart: '0',
                        marginBlockEnd: '0',
                        marginInlineStart: '0',
                        marginInlineEnd: '0',
                  }}>{tokenAmount.toLocaleString()}</p>
                    <p style={{fontSize:'0.5rem',
                        marginBlockStart: '0',
                        marginBlockEnd: '0',
                        marginInlineStart: '0px',
                        marginInlineEnd: '0px',
                  }}>{tokenDetails.TokenSymbol}</p>
                    </div>)
                }
                  }else{
                    if (filterLPAddress[0].token0.toLowerCase() == tokenDetails.tokenAddress.toLowerCase()) {
                      const logs =  swap['decodeLogs']
                      const amount0In = logs['amount0In']
                      const amount0Out = logs['amount0Out']

                      const amount1Out = logs['amount1Out']
                      const type = amount1Out == 0 ? 'BUY' : 'SELL'
                      const tokenAmount = type =='SELL' ? amount0In / `1${"0".repeat(props.TokenDetails.TokenDecimals)}`:  amount0Out / `1${"0".repeat(props.TokenDetails.TokenDecimals)}`

                      return (<div className={type}>
                        <p style={{fontSize:'1rem',
                            marginBlockStart: '0',
                            marginBlockEnd: '0',
                            marginInlineStart: '0',
                            marginInlineEnd: '0',
                      }}>{tokenAmount.toLocaleString()}</p>
                        <p style={{fontSize:'0.5rem',
                            marginBlockStart: '0',
                            marginBlockEnd: '0',
                            marginInlineStart: '0px',
                            marginInlineEnd: '0px',
                      }}>{tokenDetails.TokenSymbol}</p>
                        </div>)
                    }

                if (filterLPAddress[0].token1.toLowerCase() == tokenDetails.tokenAddress.toLowerCase()) {
                  const logs =  swap['decodeLogs']
                      const amount0Out = logs['amount0Out']
                      const amount1In = logs['amount1In']
                      const amount1Out = logs['amount1Out']
                      const type = amount0Out == 0 ? 'BUY' : 'SELL'
                      const tokenAmount = type =='SELL' ? amount1In / `1${"0".repeat(props.TokenDetails.TokenDecimals)}`:  amount1Out / `1${"0".repeat(props.TokenDetails.TokenDecimals)}`
                    
                      return (<div className={type}>
                        <p style={{fontSize:'1rem',
                            marginBlockStart: '0',
                            marginBlockEnd: '0',
                            marginInlineStart: '0',
                            marginInlineEnd: '0',
                      }}>{tokenAmount.toLocaleString()}</p>
                        <p style={{fontSize:'0.5rem',
                            marginBlockStart: '0',
                            marginBlockEnd: '0',
                            marginInlineStart: '0px',
                            marginInlineEnd: '0px',
                      }}>{tokenDetails.TokenSymbol}</p>
                        </div>)
                }
                  }
                  }




                }} disableSort={true} 
                width={300} 
                label="Tokens" 
                dataKey="tokensAmount" />

                {/* Amount USD */}

                <Column disableSort={true} 
                cellRenderer={(col)=>{
                const swap = props.swaps[col.rowIndex]

                const tokenDetails = props.TokenDetails
                const filterLPAddress = tokenDetails.lpaddress.filter((element, index, array) => { 
                  return element.address == swap.address} )

                  if(filterLPAddress.length > 0){
                    if (filterLPAddress[0].type == 'BUSD') {
                    if (filterLPAddress[0].token0.toLowerCase() == tokenDetails.tokenAddress.toLowerCase()) {
                      const logs =  swap['decodeLogs']
                      const amount0In = logs['amount0In']
                      const amount0Out = logs['amount0Out']
                      const amount1In = logs['amount1In']
                      const amount1Out = logs['amount1Out']
                      const type = amount1Out == 0 ? 'BUY' : 'SELL'
                      const bUSDAmount = type =='SELL' ? parseFloat(amount1Out / `1${"0".repeat(18)}`).toFixed(6): parseFloat(amount1In / `1${"0".repeat(18)}`).toFixed(6)
                      const bnbAmount = parseFloat(bUSDAmount / props.bnbPrice).toFixed(2)
                      const USDAmount = parseFloat(props.bnbPrice * bnbAmount).toFixed(2)
                      return <span className={type}>${USDAmount}</span>
                    }

                if (filterLPAddress[0].token1.toLowerCase() == tokenDetails.tokenAddress.toLowerCase()) {
                  const logs =  swap['decodeLogs']
                      const amount0In = logs['amount0In']
                      const amount0Out = logs['amount0Out']
                      const type = amount0Out == 0 ? 'BUY' : 'SELL'
                      const bUSDAmount = type =='SELL' ? parseFloat(amount0Out / `1${"0".repeat(18)}`).toFixed(6): parseFloat(amount0In / `1${"0".repeat(18)}`).toFixed(6)
                      const bnbAmount = parseFloat(bUSDAmount / props.bnbPrice).toFixed(6)
                      const USDAmount = parseFloat(props.bnbPrice * bnbAmount).toFixed(2)
                      return <span className={type}>${USDAmount}</span>
                }
                  }else{
                    if (filterLPAddress[0].token0.toLowerCase() == tokenDetails.tokenAddress.toLowerCase()) {
                      const logs =  swap['decodeLogs']
                      const amount1In = logs['amount1In']
                      const amount1Out = logs['amount1Out']
                      const type = amount1Out == 0 ? 'BUY' : 'SELL'
                      const bnbAmount = type =='SELL' ? parseFloat(amount1Out / `1${"0".repeat(18)}`).toFixed(6): parseFloat(amount1In / `1${"0".repeat(18)}`).toFixed(6)
                      const USDAmount = parseFloat(props.bnbPrice * bnbAmount).toFixed(2)
                      return <span className={type}>${USDAmount}</span>
                    }

                if (filterLPAddress[0].token1.toLowerCase() == tokenDetails.tokenAddress.toLowerCase()) {
                  const logs =  swap['decodeLogs']
                  const amount0In = logs['amount0In']
                  const amount0Out = logs['amount0Out']
                  const type = amount0Out == 0 ? 'BUY' : 'SELL'
                  const bnbAmount = type =='SELL' ? parseFloat(amount0Out / `1${"0".repeat(18)}`).toFixed(6): parseFloat(amount0In / `1${"0".repeat(18)}`).toFixed(6)
                  const USDAmount = parseFloat(props.bnbPrice * bnbAmount).toFixed(2)
                  return <span className={type}>${USDAmount}</span>
                }
                  }
                  }

                  

                
                }} 
                disableSort={true}  
                width={300} 
                label="Amount(USD)" 
                dataKey={'logIndex'}  />               


                {/* Amount BNB */}

                <Column disableSort={true} 
                cellRenderer={(col)=>{
                const swap = props.swaps[col.rowIndex]

                const tokenDetails = props.TokenDetails
                const filterLPAddress = tokenDetails.lpaddress.filter((element, index, array) => { 
                  return element.address == swap.address} )

                  if(filterLPAddress.length > 0){
                                      if (filterLPAddress[0].type == 'BUSD') {
                    if (filterLPAddress[0].token0.toLowerCase() == tokenDetails.tokenAddress.toLowerCase()) {
                      const logs =  swap['decodeLogs']
                      const amount0In = logs['amount0In']
                      const amount0Out = logs['amount0Out']
                      const amount1In = logs['amount1In']
                      const amount1Out = logs['amount1Out']
                      const type = amount1Out == 0 ? 'BUY' : 'SELL'
                      const bUSDAmount = type =='SELL' ? parseFloat(amount1Out / `1${"0".repeat(18)}`).toFixed(6): parseFloat(amount1In / `1${"0".repeat(18)}`).toFixed(6)
                      const bnbAmount = parseFloat(bUSDAmount / props.bnbPrice).toFixed(6)
                      return <span className={type}>{bnbAmount}</span>
                    }

                if (filterLPAddress[0].token1.toLowerCase() == tokenDetails.tokenAddress.toLowerCase()) {
                  const logs =  swap['decodeLogs']
                      const amount0In = logs['amount0In']
                      const amount0Out = logs['amount0Out']
                      const amount1In = logs['amount1In']
                      const amount1Out = logs['amount1Out']
                      const type = amount0Out == 0 ? 'BUY' : 'SELL'
                      const bUSDAmount = type =='SELL' ? parseFloat(amount0Out / `1${"0".repeat(18)}`).toFixed(6): parseFloat(amount0In / `1${"0".repeat(18)}`).toFixed(6)
                      const bnbAmount = parseFloat(bUSDAmount / props.bnbPrice).toFixed(6)
                      return <span className={type}>{bnbAmount}</span>
                }
                  }else{
                    if (filterLPAddress[0].token0.toLowerCase() == tokenDetails.tokenAddress.toLowerCase()) {
                      const logs =  swap['decodeLogs']
                      const amount0In = logs['amount0In']
                      const amount0Out = logs['amount0Out']
                      const amount1In = logs['amount1In']
                      const amount1Out = logs['amount1Out']
                      const type = amount1Out == 0 ? 'BUY' : 'SELL'
                      const bnbAmount = type =='SELL' ? parseFloat(amount1Out / `1${"0".repeat(18)}`).toFixed(6): parseFloat(amount1In / `1${"0".repeat(18)}`).toFixed(6)
                      return <span className={type}>{bnbAmount}</span>
                    }

                if (filterLPAddress[0].token1.toLowerCase() == tokenDetails.tokenAddress.toLowerCase()) {
                  const logs =  swap['decodeLogs']
                  const amount0In = logs['amount0In']
                  const amount0Out = logs['amount0Out']
                  const amount1In = logs['amount1In']
                  const amount1Out = logs['amount1Out']
                  const type = amount0Out == 0 ? 'BUY' : 'SELL'
                  const bnbAmount = type =='SELL' ? parseFloat(amount0Out / `1${"0".repeat(18)}`).toFixed(6): parseFloat(amount0In / `1${"0".repeat(18)}`).toFixed(6)
                  return <span className={type}>{bnbAmount}</span>
                }
                  }
                  }



                
                }} 
                disableSort={true}  
                width={300} 
                label="Amount(BNB)"
                dataKey={'removed'}  />      
                         
                {/* Amount Per Token USD */}

                <Column disableSort={true} 
                cellRenderer={(col)=>{
                const swap = props.swaps[col.rowIndex]

                const tokenDetails = props.TokenDetails
                const filterLPAddress = tokenDetails.lpaddress.filter((element, index, array) => { 
                  return element.address == swap.address} )


                  if(filterLPAddress.length > 0){
                    if (filterLPAddress[0].type == 'BUSD') {
                    if (filterLPAddress[0].token0.toLowerCase() == tokenDetails.tokenAddress.toLowerCase()) {
                      

                      const logs =  swap['decodeLogs']
                      const amount0In = logs['amount0In']
                      const amount0Out = logs['amount0Out']
                      const amount1In = logs['amount1In']
                      const amount1Out = logs['amount1Out']
                      const type = amount1Out == 0 ? 'BUY' : 'SELL'
                      const bUSDAmount = type =='SELL' ? parseFloat(amount1Out / `1${"0".repeat(18)}`).toFixed(6): parseFloat(amount1In / `1${"0".repeat(18)}`).toFixed(6)
                      const bnbAmount = parseFloat(bUSDAmount / props.bnbPrice).toFixed(18)
                      const USDAmount = parseFloat(props.bnbPrice * bnbAmount).toFixed(5)
         
                      const tokenAmount = type =='SELL' ? amount0In / `1${"0".repeat(props.TokenDetails.TokenDecimals)}`:  amount0Out / `1${"0".repeat(props.TokenDetails.TokenDecimals)}`
                      const PPT =  USDAmount / tokenAmount
                      var m = -Math.floor( Math.log10(PPT) + 1)   
                      console.log(m);  
                      return <div> 
                  <p style={{
                    marginBlockStart: '0em',
                    marginBlockEnd: '0'

                  }} className={type}>${isFinite(m) && m < 96 ? parseFloat(PPT).toFixed(m + 4): 0.00000}</p>
                  <small className={type}>psV{filterLPAddress[0].psV}</small>
                  </div> 
                    }

                if (filterLPAddress[0].token1.toLowerCase() == tokenDetails.tokenAddress.toLowerCase()) {
                  const logs =  swap['decodeLogs']
                  const amount0In = logs['amount0In']
                  const amount0Out = logs['amount0Out']
                  const amount1In = logs['amount1In']
                  const amount1Out = logs['amount1Out']
                      const type = amount0Out == 0 ? 'BUY' : 'SELL'
                      const bUSDAmount = type =='SELL' ? parseFloat(amount0Out / `1${"0".repeat(18)}`).toFixed(6): parseFloat(amount0In / `1${"0".repeat(18)}`).toFixed(6)
                      const bnbAmount = parseFloat(bUSDAmount / props.bnbPrice).toFixed(6)
                      const USDAmount = parseFloat(props.bnbPrice * bnbAmount).toFixed(2)
                      const tokenAmount = type =='SELL' ? amount1In / `1${"0".repeat(props.TokenDetails.TokenDecimals)}`:  amount1Out / `1${"0".repeat(props.TokenDetails.TokenDecimals)}`
                      const PPT =  USDAmount / tokenAmount
                      var m = -Math.floor( Math.log10(PPT) + 1)
                      console.log(m);
                      return <div> <p style={{
                    marginBlockStart: '0em',
                    marginBlockEnd: '0'
                  }} className={type}>${isFinite(m) && m < 96 ? parseFloat(PPT).toFixed(m + 4): 0.00000}</p>
                  <small className={type}>psV{filterLPAddress[0].psV}</small>
                  </div> 
                }
                  }else{
                    if (filterLPAddress[0].token0.toLowerCase() == tokenDetails.tokenAddress.toLowerCase()) {
                      const logs =  swap['decodeLogs']
                      const amount0In = logs['amount0In']
                      const amount0Out = logs['amount0Out']
                      const amount1In = logs['amount1In']
                      const amount1Out = logs['amount1Out']
                      const type = amount1Out == 0 ? 'BUY' : 'SELL'
                      const bnbAmount = type =='SELL' ? parseFloat(amount1Out / `1${"0".repeat(18)}`).toFixed(6): parseFloat(amount1In / `1${"0".repeat(18)}`).toFixed(6)
                      const USDAmount = parseFloat(props.bnbPrice * bnbAmount).toFixed(2)
                      const tokenAmount = type =='SELL' ? amount0In / `1${"0".repeat(props.TokenDetails.TokenDecimals)}`:  amount0Out / `1${"0".repeat(props.TokenDetails.TokenDecimals)}`
                      const PPT =  USDAmount / tokenAmount
                      var m = -Math.floor( Math.log10(PPT) + 1)

                      return <div> <p style={{
                    marginBlockStart: '0em',
                    marginBlockEnd: '0'
                  }} className={type}>${isFinite(m) && m < 96 ? parseFloat(PPT).toFixed(m + 4 > 100 ? 100: m + 4): 0.00000}</p>
                  <small className={type}>psV{filterLPAddress[0].psV}</small>
                  </div> 
                    }

                if (filterLPAddress[0].token1.toLowerCase() == tokenDetails.tokenAddress.toLowerCase()) {
                  const logs =  swap['decodeLogs']
                  const amount0In = logs['amount0In']
                  const amount0Out = logs['amount0Out']
                  const amount1In = logs['amount1In']
                  const amount1Out = logs['amount1Out']
                  const type = amount0Out == 0 ? 'BUY' : 'SELL'
                  const bnbAmount = type =='SELL' ? parseFloat(amount0Out / `1${"0".repeat(18)}`).toFixed(6): parseFloat(amount0In / `1${"0".repeat(18)}`).toFixed(6)
                  const USDAmount = parseFloat(props.bnbPrice * bnbAmount).toFixed(2)
                  const tokenAmount = type =='SELL' ? amount1In / `1${"0".repeat(props.TokenDetails.TokenDecimals)}`:  amount1Out / `1${"0".repeat(props.TokenDetails.TokenDecimals)}`
                  const PPT =  USDAmount / tokenAmount
                  var m = -Math.floor( Math.log10(PPT) + 1)
        
                  return <div> 
                  <p style={{
                    marginBlockStart: '0em',
                    marginBlockEnd: '0'

                  }} className={type}>${isFinite(m) && m < 96 ? parseFloat(PPT).toFixed(m + 4): 0.00000}</p>
                  <small className={type}>psV{filterLPAddress[0].psV}</small>
                  </div> 
                }
                  }
                  }

                  

                
                }} 
                disableSort={true}  
                width={300} 
                label="Price/Token" 
                dataKey={'logIndex'}  />               

                         
                {/* TX id Col */}    
                <Column 
                cellRenderer={(col)=>{

                  const swap = props.swaps[col.rowIndex]
                  const tokenDetails = props.TokenDetails
                  const filterLPAddress = tokenDetails.lpaddress.filter((element, index, array) => { 
                    return element.address == swap.address} )
  
                    if(filterLPAddress.length > 0){
                      if (filterLPAddress[0].type == 'BUSD') {
                      if (filterLPAddress[0].token0.toLowerCase() == tokenDetails.tokenAddress.toLowerCase()) {
                        const swap = props.swaps[col.rowIndex]
                        const txURL = `https://bscscan.com/tx/${swap.transactionHash}`
                        return <a style={{color:'white'}} href={txURL} target="_blank">{swap.transactionHash.substring(0,6)}</a>
                      
                        }
  
                  if (filterLPAddress[0].token1.toLowerCase() == tokenDetails.tokenAddress.toLowerCase()) {
                    const swap = props.swaps[col.rowIndex]
                     const txURL = `https://bscscan.com/tx/${swap.transactionHash}`

                    return <a style={{color:'white'}} href={txURL} target="_blank">{swap.transactionHash.substring(0,6)}</a>
                
                  }
                    }else{
                      if (filterLPAddress[0].token0.toLowerCase() == tokenDetails.tokenAddress.toLowerCase()) {
                        const swap = props.swaps[col.rowIndex]
                        const txURL = `https://bscscan.com/tx/${swap.transactionHash}`
                        return <a style={{color:'white'}} href={txURL} target="_blank">{swap.transactionHash.substring(0,6)}</a>
                
                      }
  
                  if (filterLPAddress[0].token1.toLowerCase() == tokenDetails.tokenAddress.toLowerCase()) {
                    const swap = props.swaps[col.rowIndex]
                    const txURL = `https://bscscan.com/tx/${swap.transactionHash}`

                    return <a style={{color:'white'}} href={txURL} target="_blank">{swap.transactionHash.substring(0,6)}</a>
                
                  }
                    }
                    }

              }} disableSort={true}  
                width={300} 
                label="Tx ID" 
                dataKey={'transactionHash'}  />   
                
        
              </Table>
            )}
          </AutoSizer>
        </div>);
      }
      else{
        return(<div>Loading...</div>)
      }
      }
  
      

      
    
    }
}


export default SwapTable
