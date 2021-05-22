import React, { useEffect, useState,useRef, useContext, createContext } from 'react'
import '../App.css'
import SwapTable from '../components/SwapTable';
import TradingChart from '../components/TradingChart.js';


import {useQuery, gql} from '@apollo/client'
import { GET_CHART_DATA } from '../components/Queries';
import {Web3Context} from '../components/Contexts/Web3Context.js'
import {BlockContext} from '../components/Contexts/useBlockContext.js'
import {TokenContext} from '../components/Contexts/TokenContext.js'
import {TokenContextProvider} from '../components/Contexts/TokenContext.js'
import CircularProgress from '@material-ui/core/CircularProgress';
import SideTab from '../components/SideTab';
import TokenInfoBar from '../components/TokenInfoBar';

const Binance = require('node-binance-api');


let PoolData={};


const binance = new Binance().options({
  APIKEY: '',
  APISECRET: ''
});


const Token = (props) => {

  const swapWeb3Context = useContext(Web3Context)
  const web3 = swapWeb3Context.web3
  
  const multicall = swapWeb3Context.multicall
  const swapBlockContext = useContext(BlockContext)


    const [swaps, setswaps] = useState([]);
    const [bnbPriceUSD, setbnbPriceUSD] = useState(0);
    const [isLoading, setisLoading] = useState(true);
    const [candleData, setcandleData] = useState([]);
    const [chartInterval, setchartInterval] = useState(15);
    const [lpAddress, setlpAddress] = useState([]);
    const [tokenDetails, settokenDetails] = useState({});
    


useEffect(async () => {
  const contractCallContext = [
    {
        reference: 'pancakeContractv1',
        contractAddress: '0xbcfccbde45ce874adcb698cc183debcf17952812',
        abi: [{"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token0","type":"address"},{"indexed":true,"internalType":"address","name":"token1","type":"address"},{"indexed":false,"internalType":"address","name":"pair","type":"address"},{"indexed":false,"internalType":"uint256","name":"","type":"uint256"}],"name":"PairCreated","type":"event"},{"constant":true,"inputs":[],"name":"INIT_CODE_PAIR_HASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allPairs","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"allPairsLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"}],"name":"createPair","outputs":[{"internalType":"address","name":"pair","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"feeTo","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"feeToSetter","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"getPair","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeTo","type":"address"}],"name":"setFeeTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"name":"setFeeToSetter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}],
        calls: [
          { reference: 'getPairCallv1', methodName: 'getPair', methodParameters: [props.match.params.tokenAddress,"0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"] },
          { reference: 'getPairBUSDCallv1', methodName: 'getPair', methodParameters: [props.match.params.tokenAddress,"0xe9e7cea3dedca5984780bafc599bd69add087d56"] }
        ]
    },
    {
        reference: 'pancakeContractv2',
        contractAddress: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
        abi: [{"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token0","type":"address"},{"indexed":true,"internalType":"address","name":"token1","type":"address"},{"indexed":false,"internalType":"address","name":"pair","type":"address"},{"indexed":false,"internalType":"uint256","name":"","type":"uint256"}],"name":"PairCreated","type":"event"},{"constant":true,"inputs":[],"name":"INIT_CODE_PAIR_HASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allPairs","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"allPairsLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"}],"name":"createPair","outputs":[{"internalType":"address","name":"pair","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"feeTo","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"feeToSetter","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"getPair","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeTo","type":"address"}],"name":"setFeeTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"name":"setFeeToSetter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}],
        calls: [
          { reference: 'getPairCallv2', methodName: 'getPair', 
          methodParameters: [props.match.params.tokenAddress,"0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"] },
          { reference: 'getBNBUSDPairCallv2', methodName: 'getPair', 
          methodParameters: ["0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c","0xe9e7cea3dedca5984780bafc599bd69add087d56"] },
          { reference: 'getPairBUSDCallv2', methodName: 'getPair', methodParameters: [props.match.params.tokenAddress,"0xe9e7cea3dedca5984780bafc599bd69add087d56"] }
        ]
    },


    {
      reference: 'TokenContract',
      contractAddress: props.match.params.tokenAddress,
      abi: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"_getBurnFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_getMaxTxAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_getTaxFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"burnFee","type":"uint256"}],"name":"_setBurnFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"taxFee","type":"uint256"}],"name":"_setTaxFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tAmount","type":"uint256"}],"name":"deliver","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"excludeAccount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"includeAccount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isExcluded","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tAmount","type":"uint256"},{"internalType":"bool","name":"deductTransferFee","type":"bool"}],"name":"reflectionFromToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"rAmount","type":"uint256"}],"name":"tokenFromReflection","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalBurn","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalFees","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}],
      calls: [
        { reference: 'tokenName', methodName: 'name', methodParameters: [] },
        { reference: 'tokenSymbol', methodName: 'symbol', methodParameters: [] },
        { reference: 'tokenDecimals', methodName: 'decimals', methodParameters: [] },
        { reference: 'tokenTS', methodName: 'totalSupply', methodParameters: [] },
      ]
  },
];

const pairNtokenResults = await multicall.call(contractCallContext);

let tokenPairBNBv1Address =pairNtokenResults.results.pancakeContractv1.callsReturnContext[0].returnValues[0]
let tokenPairBNBv2Address =pairNtokenResults.results.pancakeContractv2.callsReturnContext[0].returnValues[0]
let tokenPairBUSDv1Address =pairNtokenResults.results.pancakeContractv1.callsReturnContext[1].returnValues[0]
let tokenPairBUSDv2Address =pairNtokenResults.results.pancakeContractv2.callsReturnContext[2].returnValues[0]

let BNBUSDPairv2Address =pairNtokenResults.results.pancakeContractv2.callsReturnContext[1].returnValues[0]

const tokenPairAddressArray = [tokenPairBNBv1Address,tokenPairBNBv2Address, tokenPairBUSDv1Address, tokenPairBUSDv2Address]

let filteredAddress = tokenPairAddressArray.filter(address =>  address != '0x0000000000000000000000000000000000000000')

filteredAddress = filteredAddress.map((address,i) =>{
  return {
    reference: 'tokenPair' + i,
    contractAddress: address,
    abi: [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount0Out","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1Out","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Swap","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint112","name":"reserve0","type":"uint112"},{"indexed":false,"internalType":"uint112","name":"reserve1","type":"uint112"}],"name":"Sync","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MINIMUM_LIQUIDITY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"burn","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getReserves","outputs":[{"internalType":"uint112","name":"_reserve0","type":"uint112"},{"internalType":"uint112","name":"_reserve1","type":"uint112"},{"internalType":"uint32","name":"_blockTimestampLast","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_token0","type":"address"},{"internalType":"address","name":"_token1","type":"address"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"kLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"liquidity","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"price0CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"price1CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"skim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount0Out","type":"uint256"},{"internalType":"uint256","name":"amount1Out","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"sync","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}],
    calls: [{ reference: 'getReservesCall', methodName: 'getReserves', methodParameters: [] },
    { reference: 'getToken0', methodName: 'token0', methodParameters: [] },
    { reference: 'getToken1', methodName: 'token1', methodParameters: [] }
  ]
}
})


  
const ReservesToken0CallContext = [
 ...filteredAddress,
{
  reference: 'tokenDetails',
  contractAddress: props.match.params.tokenAddress,
  abi: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"_getBurnFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_getMaxTxAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_getTaxFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"burnFee","type":"uint256"}],"name":"_setBurnFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"taxFee","type":"uint256"}],"name":"_setTaxFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tAmount","type":"uint256"}],"name":"deliver","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"excludeAccount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"includeAccount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isExcluded","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tAmount","type":"uint256"},{"internalType":"bool","name":"deductTransferFee","type":"bool"}],"name":"reflectionFromToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"rAmount","type":"uint256"}],"name":"tokenFromReflection","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalBurn","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalFees","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}],
  calls: [ 
    { reference: 'getName', methodName: 'name', methodParameters: [] },
    { reference: 'getSymbol', methodName: 'symbol', methodParameters: [] },
    { reference: 'getDecimals', methodName: 'decimals', methodParameters: [] },
    { reference: 'getTotalSupply', methodName: 'totalSupply', methodParameters: [] },
    
    ]
},
]

const ReservesToken0Results = await multicall.call(ReservesToken0CallContext);


 const Token0Results = filteredAddress.map((element,i) => {


  const token0 = ReservesToken0Results.results['tokenPair'+i].callsReturnContext[1].returnValues[0];
  return {
    'address':element.contractAddress,
    token0
  }
});


const TokenName = ReservesToken0Results.results.tokenDetails.callsReturnContext[0].returnValues[0]
const TokenSymbol = ReservesToken0Results.results.tokenDetails.callsReturnContext[1].returnValues[0]
const TokenDecimals = ReservesToken0Results.results.tokenDetails.callsReturnContext[2].returnValues[0]
const TokenSupply = web3.utils.hexToNumberString(ReservesToken0Results.results.tokenDetails.callsReturnContext[3].returnValues[0].hex)
const tokenMC = ''


settokenDetails({
  TokenName,
  TokenSymbol,
  TokenDecimals,
  TokenSupply,
  tokenMC
})



setisLoading(false)

setlpAddress([{
  [tokenPairBNBv1Address] : 'BNB',
  [tokenPairBNBv2Address] : 'BNB',
  [tokenPairBUSDv1Address] : 'BUSD',
  [tokenPairBUSDv2Address] : 'BUSD'
},Token0Results])





}, [props.match.params.tokenAddress]);


    const {error,loading,data,refetch} = useQuery(GET_CHART_DATA,{
      variables:{
        "baseCurrency": props.match.params.tokenAddress,
        "quoteCurrency": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
        "since": "2021-05-14T22:35:00.000Z",
        "till": "2021-05-17T13:35:00.000Z",
        "window": chartInterval,
        "exchangeAddresses": [
          "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"
        ],
        "minTrade": 10
      }
  })

  useEffect( async () => {
    setswaps([])
  },[props.match.params.tokenAddress])

      useEffect( async () => {
        console.log('Started Fetch BNB price Effect');
        binance.prices('BNBUSDT', (error, ticker) => {
          setbnbPriceUSD(parseFloat(ticker.BNBUSDT));
        });
      },[props.match.params.tokenAddress])
      
      useEffect(() => {
            console.log(`Refetching Chart Data - ${chartInterval}m` )
            refetch()
          }, [props.match.params.tokenAddress,chartInterval])

        useEffect(() => {
          console.log('New Data Found');
          if (typeof data !== 'undefined') {

           const formatedkline = data.ethereum.dexTrades.map((kline)=>{

              return{
                "time":new Date(kline.timeInterval.minute).getTime()/ 1000,
                "open": bnbPriceUSD * kline.open_price,
                "high": bnbPriceUSD * kline.maximum_price,
                "low": bnbPriceUSD * kline.minimum_price,
                "close": bnbPriceUSD * kline.close_price,
                "volume":  kline.tradeAmount
              }
            })
            
            setcandleData(formatedkline)
          } 
        }, [data])
    

        useEffect(() => {

          const initSwap = async ()=>{

            const swapevents = await web3.eth.getPastLogs({
              address: Object.keys(lpAddress[0]),
              topics: ["0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822"],
              fromBlock:swapBlockContext.LatestBlock.number - 4500,
              toBlock: 'latest'
            })
            const swapABI = [
                          {
                            'type': 'uint256',
                            'name': 'amount0In'
                          },{
                            'type': 'uint256',
                            'name': 'amount1In'
                          },
                          {
                          'type': 'uint256',
                          'name': 'amount0Out'
                        },{
                          'type': 'uint256',
                          'name': 'amount1Out'
                        },]
            const promises = swapevents.map(async event=>{
              const blockData = await web3.eth.getBlock(event.blockNumber)
                event['blockData'] = blockData
                const decodeLogs = web3.eth.abi.decodeLog(swapABI,event.data)
                event['decodeLogs'] = decodeLogs
                
                return event
            
            })

           
            const results = await Promise.all(promises)
   
            setswaps([...swaps, ...results].reverse())
          }
          if (lpAddress.length > 0) {
            initSwap()
          }
          
          
      }, [lpAddress])


        useEffect(() => {

          const initSwap = async ()=>{


            const swapevents = await web3.eth.getPastLogs({
              address: Object.keys(lpAddress[0]),
              topics: ["0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822"],
              fromBlock:swapBlockContext.LatestBlock.number,
              toBlock: 'latest'
            })

            const syncevents = await web3.eth.getPastLogs({
              address: Object.keys(lpAddress[0]),
              topics: ["0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1"],
              fromBlock:swapBlockContext.LatestBlock.number,
              toBlock: 'latest'
            })
            if (swapevents.length > 0) {
              const swapABI = [
                {
                  'type': 'uint256',
                  'name': 'amount0In'
                },{
                  'type': 'uint256',
                  'name': 'amount1In'
                },
                {
                'type': 'uint256',
                'name': 'amount0Out'
              },{
                'type': 'uint256',
                'name': 'amount1Out'
              },]
  
              swapevents.map(event=>{
                  event['blockData'] = swapBlockContext.LatestBlock
                  const decodeLogs = web3.eth.abi.decodeLog(swapABI,event.data)
                  event['decodeLogs'] = decodeLogs
              })


              setswaps([...swapevents, ...swaps])

            }

            if (syncevents.length > 0) {
              const syncABI = [{
                'type': 'uint112',
                'name': 'reserve0'
              },{
                'type': 'uint112',
                'name': 'reserve1'
              },]
              const decodeLogs = web3.eth.abi.decodeLog(syncABI,syncevents[syncevents.length - 1].data)
              
              const token0 = decodeLogs[0] / `1${"0".repeat(tokenDetails.TokenDecimals)}`

              const token1 = decodeLogs[1] / `1${"0".repeat(18)}`

              console.log(token0);
              console.log(token1);
              const tokenPrice = (token1 / token0)
              
              console.log('Token Price: ' + tokenPrice);

              const tokenMC = (tokenPrice * tokenDetails.TokenSupply)

              settokenDetails({...tokenDetails,tokenMC})

            }
              
          }
          if (lpAddress.length > 0) {
            initSwap()
          }
          
          
      }, [swapBlockContext.LatestBlock,props.match.params.tokenAddress])




    return (
      <TokenContextProvider>
    <div className="token-main-container">
          <div className="token-info-container">
          <SideTab />
          </div>
          <div className="token-chart-swap-container">
          <TokenInfoBar 
          tokenDetails={tokenDetails}
          tokenAddress={props.match.params.tokenAddress}
          />
          <select onChange={(e)=>{setchartInterval(e.target.value)}} name="chartInterval"  id="chartIntervalSelect">
            <option value="1">1m</option>
            <option value="5">5m</option>
            <option value="10">10m</option>
            <option defaultValue value="15">15m</option>
            <option value="30">30m</option>
            <option value="60">1h</option>
            <option value="240">4h</option>
            <option value="720">12h</option>
            <option value="1440">24h</option>
          </select> 
          <TradingChart candleDataArr={candleData} bnbPrice={bnbPriceUSD} tokenAddress={props.match.params.tokenAddress}/>
          <div className="token-swap-feed-container">
            <SwapTable swaps={swaps} TokenDetails={tokenDetails} bnbPrice={bnbPriceUSD}/>
          </div>
          
          </div>
        
        </div>
    </TokenContextProvider>
    )
}

export default Token
