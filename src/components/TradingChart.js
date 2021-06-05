import React, {useState, useEffect, useRef, useContext} from 'react'
import { createChart } from 'lightweight-charts'
import {useQuery, gql} from '@apollo/client'
import { GET_CHART_DATA } from './Queries';
import {Web3Context} from './Contexts/Web3Context.js'
import {LSContext} from './Contexts/LSContext.js'

let chart;
let candlestickSeries= null;



    


const TradingChart = (props) => {
    
  const tradingChart = useRef()

  const TCLSContext = useContext(LSContext)
  const TCWeb3Context = useContext(Web3Context)
  const web3 = TCWeb3Context.web3

  const [isLoading, setisLoading] = useState(true);
  
  const [since, setsince] = useState("2021-05-29T23:00:00.000Z")
  const [till, settill] = useState("2021-05-31T22:00:00.000Z")
  const [candleDataArr, setcandleDataArr] = useState([])

  const {error,loading,data,refetch} = useQuery(GET_CHART_DATA,{
      variables:{
        "baseCurrency": props.tokenAddress,
        "quoteCurrency": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
        "since": since,
        "till": till,
        "window": props.interval,
        "exchangeAddresses": [
          "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"
        ],
        "minTrade": 10
      }
  })
  const getChartData = (from,to) => {
    console.log(chart.timeScale().getVisibleRange());
    console.log(from);
    console.log(to);
  }

const onVisibleLogicalRangeChanged = (newVisibleLogicalRange)=> {
  const barsInfo = candlestickSeries.barsInLogicalRange(newVisibleLogicalRange);
  

  if (barsInfo !== null && barsInfo.barsBefore < 50) {
    var fromSeconds = barsInfo.from;
    var from = new Date(0);
    from.setUTCSeconds(fromSeconds);
    var toSeconds = chart.timeScale().getVisibleRange().from;
    var to = new Date(0);
    to.setUTCSeconds(toSeconds);
    getChartData(from,to)
  }
}



  useEffect(() => {
    chart = createChart(tradingChart.current, { 
      Width:500,
      Height:500,
      timeScale: {
        rightOffset: 12,
        barSpacing: 3,
        lockVisibleTimeRangeOnResize: true,
        rightBarStaysOnScroll: true,
        borderVisible: false,
        borderColor: '#fff000',
        visible: true,
        timeVisible: true,
        secondsVisible: false,
    },
     });
    candlestickSeries = chart.addCandlestickSeries();

  
  
    chart.timeScale().subscribeVisibleLogicalRangeChange(onVisibleLogicalRangeChanged);

  }, []);

  useEffect(() => {
    refetch()
  }, [props.interval])

  useEffect(() => {

    if (typeof data !== 'undefined') {
            
      const formatedkline = data.ethereum.dexTrades.map((kline)=>{
         return{
           "time":new Date(kline.timeInterval.minute).getTime()/ 1000,
           "open": TCWeb3Context.bnbPrice * kline.open_price,
           "high": TCWeb3Context.bnbPrice * kline.maximum_price,
           "low": TCWeb3Context.bnbPrice * kline.minimum_price,
           "close": TCWeb3Context.bnbPrice * kline.close_price,
           "volume":  kline.tradeAmount
         }
       })
      setcandleDataArr(formatedkline)
      }

  }, [data]);

  useEffect(() => {
    
    const init = async()=>{
      
      if (candleDataArr.length > 0) {
        candlestickSeries.setData(candleDataArr)
        setisLoading(false)
      }else{

      }
      
      
    }
    init()
  }, [candleDataArr])


    return(<div>
      {isLoading ==true ? <p>Loading Char Data...</p> : <></>}
      <div className="trading-chart" ref={tradingChart}> </div>
      </div>)

  
    
  
}

export default TradingChart