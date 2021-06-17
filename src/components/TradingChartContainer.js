import React, {
    useState,
    useEffect,
    useRef,
    useContext
  } from 'react'
  import {
    createChart
  } from 'lightweight-charts'
  import {
    useQuery,
    gql
  } from '@apollo/client'
  import {
    GET_CHART_DATA
  } from './Queries';
  import {
    Web3Context
  } from './Contexts/Web3Context.js'
  import {
    LSContext
  } from './Contexts/LSContext.js'
  import {
    formatISO,
    subDays
  } from 'date-fns'
import RSChart from './RSChart';
import { TypeChooser } from "react-stockcharts/lib/helper";

  let chart;
  let candlestickSeries = null;
  
  
  
  
  
  
  const TradingChartContainer = (props) => {
  
      const tradingChart = useRef()
  
      const TCLSContext = useContext(LSContext)
      const TCWeb3Context = useContext(Web3Context)
      const web3 = TCWeb3Context.web3
  
      const coeff = 1000 * 60 * props.chartInterval;
  
  
  
      const [isLoading, setisLoading] = useState(true);
      const [candleDataArr, setcandleDataArr] = useState([]);
      const [since, setsince] = useState("");
      const [till, settill] = useState("currentDate.toISOString()");
  
      useEffect(() => {
        let currentDate = new Date()
        currentDate.setUTCSeconds(0)
        currentDate.setUTCMilliseconds(0)
        
        currentDate = new Date(Math.round(currentDate.getTime() / coeff) * coeff)
  
        const sinceDate = subDays(currentDate, 3)
        sinceDate.setUTCSeconds(0)
        sinceDate.setUTCMilliseconds(0)
  
        console.log('Since: ' + sinceDate);
        console.log('Till: ' + currentDate);
        setsince(sinceDate.toISOString())
        settill(currentDate.toISOString())
      }, []);
  
      const {
        error,
        loading,
        data,
        refetch
      } = useQuery(GET_CHART_DATA, {
        variables: {
          "baseCurrency": props.tokenAddress,
          "quoteCurrency": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
          "since": since,
          "till": till,
          "window": props.chartInterval,
          "exchangeAddresses": [
            "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"
          ],
          "minTrade": 10
        }
      })
  
  
      useEffect(() => {
        if (typeof data == 'object') {
          const filtercd = data.ethereum.dexTrades.map((kline) => {
            return {
              'date': new Date(kline.timeInterval.minute),
              'open': TCWeb3Context.bnbPrice * kline.open_price,
              'close': TCWeb3Context.bnbPrice * kline.close_price,
              'high': TCWeb3Context.bnbPrice * kline.maximum_price,
              'low': TCWeb3Context.bnbPrice * kline.minimum_price
            }
          })
          console.log(filtercd);
          
          setcandleDataArr(filtercd)
          setisLoading(false)
        }
  
      }, [data, TCWeb3Context.bnbPrice]);
  
      const getChartData = (from, to) => {
        console.log(chart.timeScale().getVisibleRange());
        let TillDate = new Date(to)
        TillDate.setUTCSeconds(0)
        TillDate.setUTCMilliseconds(0)
  
        TillDate = new Date(Math.round(TillDate.getTime() / coeff) * coeff)
  
        let sinceDate = new Date(from)
        sinceDate.setUTCSeconds(0)
        sinceDate.setUTCMilliseconds(0)
  
        sinceDate = new Date(Math.round(sinceDate.getTime() / coeff) * coeff)
  
        console.log('Since: ' + sinceDate.toISOString());
        console.log('Till: ' + TillDate.toISOString());
  
      }
  

  
      useEffect(() => {
          refetch()
      }, [props.tokenAddress, props.chartInterval, ])
  

  
      return ( <React.Fragment> 
        {isLoading ? <p> Loading Chart Data... </p> : 
           <RSChart type={'hybrid'} data={candleDataArr} />
    
        } 
        </React.Fragment>)
  
  
  
  
      }
  
      export default TradingChartContainer