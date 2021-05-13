import React, { useEffect, useState } from 'react'
import '../App.css'
import SwapTable from '../components/SwapTable';
import TradingChart from '../components/TradingChart.js';

import Web3 from 'web3'
import FetchTokenDetails from '../components/FetchComponents/FetchTokenDetails';
import FetchSwapData from '../components/FetchComponents/FetchSwapData';
import FetchChartData from '../components/FetchComponents/FetchChartData'

const Binance = require('node-binance-api');

let TokenDetails={};

const web3 = new Web3('https://bsc-dataseed1.defibit.io/');

let pairContract
let pairContractv2 
let runSwapLoop= null;
let candleData = []

const binance = new Binance().options({
  APIKEY: '',
  APISECRET: ''
});

const Token = (props) => {

    const [swaps, setswaps] = useState([]);
    const [bnbPriceUSD, setbnbPriceUSD] = useState(0);
    const [lastBlock, setlastBlock] = useState(0);

    
    useEffect(()=>{
      console.log('Started Fetch Contract Use Effect');
      const initContractEffect = async () =>{
      const contractv1ABI = [{"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token0","type":"address"},{"indexed":true,"internalType":"address","name":"token1","type":"address"},{"indexed":false,"internalType":"address","name":"pair","type":"address"},{"indexed":false,"internalType":"uint256","name":"","type":"uint256"}],"name":"PairCreated","type":"event"},{"constant":true,"inputs":[],"name":"INIT_CODE_PAIR_HASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allPairs","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"allPairsLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"}],"name":"createPair","outputs":[{"internalType":"address","name":"pair","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"feeTo","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"feeToSetter","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"getPair","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeTo","type":"address"}],"name":"setFeeTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"name":"setFeeToSetter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]

      const contractv2ABI = [{"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token0","type":"address"},{"indexed":true,"internalType":"address","name":"token1","type":"address"},{"indexed":false,"internalType":"address","name":"pair","type":"address"},{"indexed":false,"internalType":"uint256","name":"","type":"uint256"}],"name":"PairCreated","type":"event"},{"constant":true,"inputs":[],"name":"INIT_CODE_PAIR_HASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allPairs","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"allPairsLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"}],"name":"createPair","outputs":[{"internalType":"address","name":"pair","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"feeTo","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"feeToSetter","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"getPair","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeTo","type":"address"}],"name":"setFeeTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"name":"setFeeToSetter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
      const pairContactABI = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount0Out","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1Out","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Swap","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint112","name":"reserve0","type":"uint112"},{"indexed":false,"internalType":"uint112","name":"reserve1","type":"uint112"}],"name":"Sync","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MINIMUM_LIQUIDITY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"burn","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getReserves","outputs":[{"internalType":"uint112","name":"_reserve0","type":"uint112"},{"internalType":"uint112","name":"_reserve1","type":"uint112"},{"internalType":"uint32","name":"_blockTimestampLast","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_token0","type":"address"},{"internalType":"address","name":"_token1","type":"address"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"kLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"liquidity","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"price0CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"price1CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"skim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount0Out","type":"uint256"},{"internalType":"uint256","name":"amount1Out","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"sync","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]
      
      const contractv1 = new web3.eth.Contract(contractv1ABI,"0xBCfCcbde45cE874adCB698cC183deBcF17952812");
      const contractv2 = new web3.eth.Contract(contractv2ABI,"0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73");
      
      const pairaddressBNB = await contractv1.methods.getPair(props.match.params.tokenAddress,"0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c").call()
      const pairaddressv2BNB = await contractv2.methods.getPair(props.match.params.tokenAddress,"0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c").call()

      pairContract = new web3.eth.Contract(pairContactABI, pairaddressBNB)
      pairContractv2 = new web3.eth.Contract(pairContactABI, pairaddressv2BNB) 
      }
      initContractEffect()
      console.log('Ended Fetch Contract Use Effect');

    }, [props.match.params.tokenAddress])


  useEffect( ()=>{
    console.log('Started Fetch Token Details Effect');
    const initFetchToken = async () =>{
      TokenDetails = await FetchTokenDetails(props.match.params.tokenAddress)
      return TokenDetails;
    }
    initFetchToken()

  },[props.match.params.tokenAddress, pairContract])



    useEffect( () => {
      console.log('Started Fetch BNB price Effect');
      binance.prices('BNBUSDT', (error, ticker) => {
        setbnbPriceUSD(parseFloat(ticker.BNBUSDT));
      });
  
      console.log('Ended Fetch BNB price Effect');

    }, [props.match.params.tokenAddress])
  

    useEffect(() => {
      console.log('Started Fetch Swap Effect');
      const initSwapEffect = async ()=>{
        console.log('Init Fetch Swap Effect');
        console.log(pairContract);
        if (pairContract == undefined || pairContractv2 == undefined){
          return
        }
       const pastSwapEvents = await FetchSwapData(props.match.params.tokenAddress,pairContract,pairContractv2, web3)

       console.log(pastSwapEvents);

        setswaps([...pastSwapEvents].reverse())
        runSwapLoop=0
        setlastBlock([...pastSwapEvents].reverse()[0].blockNumber + 1)
      }
      initSwapEffect()



      console.log('Ended Fetch Swap Effect');
    }, [props.match.params.tokenAddress, pairContract]);


    useEffect(() => {
      console.log('Started Fetch Swap Effect');
      const initSwapEffect = async ()=>{
        console.log(pairContract);
        if (pairContract == undefined || pairContractv2 == undefined || lastBlock == 0){
          return
        }
       
        pairContract.getPastEvents('Swap', {
          fromBlock: lastBlock,
          toBlock: 'latest',
          topics:['0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822']
      }, (error, events)=>{ 
        if (events.length>0) {
          events = events.map((event)=>{
            return {
              "blockNumber": event.blockNumber,
              "amount0In": event.returnValues.amount0In,
              "amount0Out": event.returnValues.amount0Out,
              "amount1In": event.returnValues.amount1In,
              "amount1Out": event.returnValues.amount1Out,
              "txHash":event.transactionHash,
            }
          })

          console.log(events);

      } else{console.log('No Events found');
        } 
  }
    )


      }
      
      initSwapEffect()



      console.log('Ended Fetch Swap Effect');
    }, [props.match.params.tokenAddress, pairContract]);


    const refreshSwapsFeed = ()=>{
      console.log(lastBlock);
      if (lastBlock == 0) {
        setlastBlock(swaps[0].blockNumber + 1)
      }else{

      }

      pairContract.getPastEvents('Swap', {
        fromBlock: lastBlock,
        toBlock: 'latest',
        topics:['0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822']
    }, async (error, events)=>{ 
      if (events !=undefined && events.length > 0) {
        events = events.map((event)=>{
          return {
            "blockNumber": event.blockNumber,
            "amount0In": event.returnValues.amount0In,
            "amount0Out": event.returnValues.amount0Out,
            "amount1In": event.returnValues.amount1In,
            "amount1Out": event.returnValues.amount1Out,
            "txHash":event.transactionHash,
          }
        })
        console.log(events);
        setswaps([...events.reverse(),...swaps])
    }else{console.log('No Events found');}
  
    console.log(lastBlock)
  }
  )

  pairContractv2.getPastEvents('Swap', {
    fromBlock: lastBlock,
    toBlock: 'latest',
    topics:['0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822']
}, async (error, events)=>{ 
  if (events !=undefined && events.length > 0) {
    events = events.map((event)=>{
      return {
        "blockNumber": event.blockNumber,
        "amount0In": event.returnValues.amount0In,
        "amount0Out": event.returnValues.amount0Out,
        "amount1In": event.returnValues.amount1In,
        "amount1Out": event.returnValues.amount1Out,
        "txHash":event.transactionHash,
      }
    })
    console.log(events);
    setswaps([...events.reverse(),...swaps])
}else{console.log('No Events found');}


}
)
console.log(swaps[0]);
setlastBlock((bn)=> swaps[0].blockNumber + 1)
console.log(lastBlock)
    }

     useEffect(() => {
       if (swaps !== [] && runSwapLoop !== null){
         console.log('Started');
        setInterval(() => {
          refreshSwapsFeed()
        }, 10000); 
       }
        
    }, [runSwapLoop]) 

    useEffect( () => {
      const init = async()=>{
        if(bnbPriceUSD == undefined) return
      const data = await FetchChartData(props.match.params.tokenAddress,30, bnbPriceUSD)
      candleData= data
      }
      init()
    }, [props.match.params.tokenAddress, bnbPriceUSD])
      



    return (
        <div className="token-main-container">
          <div className="token-info-container">
            <p>Name: {Object.keys(TokenDetails).length > 0 ?TokenDetails.tokenName : "Loading..."}</p>
          </div>
          <div className="token-chart-swap-container"> 
          <TradingChart candleDataArr={candleData} bnbPrice={bnbPriceUSD} tokenAddress={props.match.params.tokenAddress}/>
          <div className="token-swap-feed-container">
            <SwapTable swaps={swaps} tokenDetails={TokenDetails} bnbPrice={bnbPriceUSD}/>
          </div>
          
          </div>
          <div className="upcoming-token-chart"></div>
        </div>
    )
}

export default Token
