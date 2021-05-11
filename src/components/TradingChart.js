
import React, {useState, useEffect, useRef} from 'react'
import {createChart} from 'lightweight-charts'
import FetchChartData from './FetchComponents/FetchChartData.js'



let chart;
let candlestickSeries= null;

const TradingChart = (props) => {
    
  const tradingChart = useRef()

  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {

    chart = createChart(tradingChart.current, { width: 900, height: 500,
      localization: {
        priceFormatter: price =>
            '$' + price
        ,
    },
    crosshair: {
      vertLine: {
          color: '#6A5ACD',
          width: 0.5,
          style: 1,
          visible: true,
          labelVisible: false,
      },
      horzLine: {
          color: '#6A5ACD',
          width: 0.5,
          style: 4,
          visible: true,
          labelVisible: true,
      },
      mode: 0,
  },
    });
    candlestickSeries = chart.addCandlestickSeries();
  }, []);


  useEffect( () => {
    const init = async()=>{
      if(props.bnbPrice == undefined) return
    const data = await FetchChartData(props.tokenAddress,30, props.bnbPrice)
      candlestickSeries.setData(data)
      setisLoading(false)
    }
    init()
  }, [props.tokenAddress, props.bnbPrice])
    
    return(<div>
      {isLoading ==true ? <p>Loading Chart Data...</p> : <> </>}
      <div ref={tradingChart}> </div>
      </div>)

  
    
   
}

export default TradingChart




