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
                rowCount={props.swaps.length}
                rowGetter={({ index }) => props.swaps[index]}
                >
                
                {/* Time Column */}

                <Column cellRenderer={(col)=>{
                const swap = props.swaps[col.rowIndex]
                const d = new Date(0); 
                d.setUTCSeconds(swap.blockData.timestamp);
                const timestamp = `${d.getHours()< 10 ? "0"+d.getHours():d.getHours()}:${d.getMinutes()< 10 ? "0"+d.getMinutes():d.getMinutes()}:${d.getUTCSeconds()< 10 ? "0"+d.getUTCSeconds():d.getUTCSeconds()}`;
                
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
                      const tokenAmount = type =='SELL' ? amount0In / `1${"0".repeat(props.TokenDetails.TokenDecimals)}`:  amount0Out / `1${"0".repeat(props.TokenDetails.TokenDecimals)}`
                      const PPT =  USDAmount / tokenAmount
                      return <span className={type}>${PPT}</span>
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
                      return <span className={type}>${PPT}</span>
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
                      return <span className={type}>${PPT.toFixed(4)}</span>
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
                  return <span className={type}>${PPT.toFixed(4)}</span>
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
                const txURL = `https://bscscan.com/tx/${swap.transactionHash}`
                return <a style={{color:'white'}} href={txURL} target="_blank">{swap.transactionHash.substring(0,6)}</a>
                }} disableSort={true}  
                width={300} label="Tx ID" 
                dataKey={'transactionHash'}  />
              
              </Table>
            )}
          </AutoSizer>
        </div>
      );
    
    }
}


export default SwapTable
