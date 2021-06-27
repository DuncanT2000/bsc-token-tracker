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



let chart;
let candlestickSeries = null;






const TradingChart = (props) => {

    const tradingChart = useRef()

    const TCLSContext = useContext(LSContext)
    const TCWeb3Context = useContext(Web3Context)
    const web3 = TCWeb3Context.web3

    const coeff = 1000 * 60 * props.chartInterval;



    const [isLoading, setisLoading] = useState(true);
    const [candleDataArr, setcandleDataArr] = useState([]);
    const [SelectedExchanges, setSelectedExchanges] = useState([]);
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
    }, [props.tokenAddress]);

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
        "exchangeAddresses": SelectedExchanges,
        "minTrade": 10
      }
    })

    const BNBUSD = useQuery(GET_CHART_DATA, {
      variables: {
        "baseCurrency": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
        "quoteCurrency": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
        "since": since,
        "till": till,
        "window": props.chartInterval,
        "exchangeAddresses": SelectedExchanges,
        "minTrade": 10
      }
    })

    useEffect(() => {
      
      if (typeof data == 'object' &&  typeof BNBUSD.data == 'object') {

        const filtercd = data.ethereum.dexTrades.map((kline, i) => {
          return {
            'time': new Date(kline.timeInterval.minute).getTime() / 1000,
            'open': BNBUSD.data.ethereum.dexTrades[i].open_price * kline.open_price,
            'close': BNBUSD.data.ethereum.dexTrades[i].close_price * kline.close_price,
            'high': BNBUSD.data.ethereum.dexTrades[i].maximum_price * kline.maximum_price,
            'low': BNBUSD.data.ethereum.dexTrades[i].minimum_price * kline.minimum_price
          }
        })
        setcandleDataArr([...filtercd])

      }

    }, [data,BNBUSD.data, TCWeb3Context.bnbPrice]);

    const getChartData = (from, to) => {
      let TillDate = new Date(to)
      TillDate.setUTCSeconds(0)
      TillDate.setUTCMilliseconds(0)

      TillDate = new Date(Math.round(TillDate.getTime() / coeff) * coeff)

      let sinceDate = new Date(from)
      sinceDate.setUTCSeconds(0)
      sinceDate.setUTCMilliseconds(0)

      sinceDate = new Date(Math.round(sinceDate.getTime() / coeff) * coeff)

      sinceDate = subDays(TillDate, 1)

      

    }



    const onVisibleLogicalRangeChanged = (newVisibleLogicalRange) => {
      const barsInfo = candlestickSeries.barsInLogicalRange(newVisibleLogicalRange);
      console.log('User is Moving Chart');
      if (barsInfo !== null && barsInfo.barsBefore < 50) {
        var fromSeconds = barsInfo.from;
        var from = new Date(0);
        from.setUTCSeconds(fromSeconds);
        var toSeconds = chart.timeScale().getVisibleRange().from;
        var to = new Date(0);
        to.setUTCSeconds(toSeconds);
        console.log(chart.timeScale().getVisibleRange());
        console.log(chart.timeScale().getVisibleLogicalRange());
        
        getChartData(from, to)
      }
    }



    useEffect(() => {
      chart = createChart(tradingChart.current, {
        Width: 500,
        Height: 500,
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
        layout: {
          backgroundColor: '#163F56',
          textColor: 'white',
          fontSize: 12,
          fontFamily: 'Calibri',
        },
        grid: {
          vertLines: {
              color: 'rgba(70, 130, 180, 0.5)',
              style: 1,
              visible: true,
          },
          horzLines: {
              color: 'rgba(70, 130, 180, 0.5)',
              style: 1,
              visible: true,
          },
      },
      crosshair:{
        mode:0
      }
      
      });
      

      candlestickSeries = chart.addCandlestickSeries();

      candlestickSeries.applyOptions({
        priceFormat: {
            type: 'custom',
            formatter: (price) => {
              var m = -Math.floor( Math.log10(price) + 1)
              return '$' + price.toFixed(m + 4)
            }
        },
    });


      chart.timeScale().subscribeVisibleLogicalRangeChange(onVisibleLogicalRangeChanged);

    }, []);

    useEffect(() => {
      let currentDate = new Date()
      currentDate.setUTCSeconds(0)
      currentDate.setUTCMilliseconds(0)
      
      currentDate = new Date(Math.round(currentDate.getTime() / coeff) * coeff)

      const sinceDate = subDays(currentDate, 3)
      sinceDate.setUTCSeconds(0)
      sinceDate.setUTCMilliseconds(0)

      console.log('Since: ' + sinceDate.toISOString());
      console.log('Till: ' + currentDate.toISOString());
      setsince(sinceDate.toISOString())
      settill(currentDate.toISOString())
      refetch()
    }, [props.tokenAddress, props.chartInterval, SelectedExchanges])

    useEffect(() => {
      setSelectedExchanges([...props.SelectedExchanges])
  }, [props.SelectedExchanges])

    useEffect(() => {

      const init = async () => {

        if (candleDataArr.length > 0) {
          candlestickSeries.setData(candleDataArr)
          setisLoading(false)
        } else {
          setisLoading(true)
        }


      }
      init()
    }, [candleDataArr])


    return ( <React.Fragment> 
      {isLoading ? <p> Loading Chart Data... </p> : <></ >
      } <div className = "trading-chart"
      ref = {
        tradingChart
      } > </div> </React.Fragment>)




    }

    export default TradingChart