import React, {useEffect, useContext} from 'react'
import '../index.css'
import {Web3Context} from './/Contexts/Web3Context.js'
import { withStyles, makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';


const SwapTable =  (props) => {

    const swapWeb3Context = useContext(Web3Context)
    const web3 = swapWeb3Context.web3

    const columns = [
        { id: 'time', label: 'Time', minWidth: 100,align: 'center' },
        { id: 'type', label: 'Type', minWidth: 100,align: 'center' },
        {id: 'amount', label: 'Amount',minWidth: 100,align: 'center'},
        {id: 'valueusd',label: 'Value(USD)',minWidth: 100,align: 'center'},
        {id: 'valuebnb',label: 'Amount(BNB)',minWidth: 100,align: 'center'},
        {id: 'ppt',label: 'Price Per Token',minWidth: 100,align: 'center'}, 
        {id: 'txId',label: 'TxId',minWidth: 100,align: 'center'},
      ];
      
      const StyledTableCell = withStyles((theme) => ({
        head: {
          backgroundColor: '#1B262C',
          color: theme.palette.common.white,
        },
        body: {
          fontSize: 15,
          backgroundColor: '#1B262C',
          
        },
        
      }))(TableCell);
      
      const StyledTableRow = withStyles((theme) => ({
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
            
          },
        },
      }))(TableRow);

      const useStyles = makeStyles({
        table: {
          minWidth: 400,
        },
      });

      const classes = useStyles();
   
      
      
        return(<Paper>
                 <TableContainer >
                 <Table stickyHeader aria-label="sticky table">
                 <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}>
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
          {props.swaps.length == 0 ? <CircularProgress size={20} disableShrink /> : ''}
          {props.swaps.map((item, i) =>{
              const d = new Date(0); 
              d.setUTCSeconds(item.blockData.timestamp);
                const timestamp = `${d.getHours()< 10 ? "0"+d.getHours():d.getHours()}:${d.getMinutes()< 10 ? "0"+d.getMinutes():d.getMinutes()}:${d.getUTCSeconds()< 10 ? "0"+d.getUTCSeconds():d.getUTCSeconds()}`;
                const txURL = `https://bscscan.com/tx/${item.transactionHash}`
                const logs =  item['decodeLogs']
                const amount0In = logs['amount0In']
                const amount0Out = logs['amount0Out']
                const amount1In = logs['amount1In']
                const amount1Out = logs['amount1Out']

                const type = amount1Out == 0 ? 'BUY' : 'SELL'
                const typecolor = type == 'BUY' ? '#7EF654': '#F65454'

                const tokenAmount = type =='SELL' ? amount0In / `1${"0".repeat(props.TokenDetails.TokenDecimals)}`:  amount0Out / `1${"0".repeat(props.TokenDetails.TokenDecimals)}`
                const usdAmount = type =='SELL' ? (props.bnbPrice * (amount1Out / `1${"0".repeat(18)}`)).toFixed(2): (props.bnbPrice * ( amount1In / `1${"0".repeat(18)}`)).toFixed(2)
                const bnbAmount = type =='SELL' ? parseFloat(amount1Out / `1${"0".repeat(18)}`).toFixed(6): parseFloat(amount1In / `1${"0".repeat(18)}`).toFixed(6)

            return (<StyledTableRow hover tabIndex={-1} key={i}>
                <StyledTableCell 
                  key={columns[0].id}
                  align={columns[0].align}
                  style={{ minWidth: columns[0].minWidth, color: typecolor }}>
                  {timestamp}
                </StyledTableCell>
                <StyledTableCell 
                  key={columns[1].id}
                  align={columns[1].align}
                  style={{ minWidth: columns[1].minWidth, color: typecolor }}>
                  {type}
                </StyledTableCell>
                <StyledTableCell 
                  key={columns[2].id}
                  align={columns[2].align}
                  style={{ minWidth: columns[2].minWidth, color: typecolor }}>
                  {tokenAmount}
                </StyledTableCell>
                <StyledTableCell 
                  key={columns[3].id}
                  align={columns[3].align}
                  style={{ minWidth: columns[3].minWidth, color: typecolor}}>
                   ${usdAmount}
                </StyledTableCell>
                <StyledTableCell 
                  key={columns[4].id}
                  align={columns[4].align}
                  style={{ minWidth: columns[4].minWidth, color: typecolor }}>
                   { bnbAmount}
                </StyledTableCell>
                <StyledTableCell 
                  key={columns[5].id}
                  align={columns[5].align}
                  style={{ minWidth: columns[5].minWidth, color: typecolor }}>
                    ${(usdAmount / tokenAmount).toFixed(12)}
                </StyledTableCell>
                <StyledTableCell 
                  key={columns[6].id}
                  align={columns[6].align}
                  style={{ minWidth: columns[6].minWidth, color: typecolor }}>
                  <a className={"swap-table-link"} href={txURL} target="_blank">{item.transactionHash.substring(0, 8)}</a>
                </StyledTableCell>
              

            </StyledTableRow>

            )
        })}  
          </TableBody>
                 </Table>
                 </TableContainer>
            </Paper>)
}


export default SwapTable
