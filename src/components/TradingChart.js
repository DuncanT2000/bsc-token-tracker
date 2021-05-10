
import React, {useState, useEffect, useRef} from 'react'
import {createChart} from 'lightweight-charts'
import FetchChartData from './FetchChartData.js'



let chart;
let candlestickSeries;

const TradingChart = (props) => {
    
  const tradingChart = useRef()


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


  useEffect(async () => {
    const data = await FetchChartData(props.tokenAddress)
    candlestickSeries.setData(data)
  }, [props.tokenAddress])

    return(<div ref={tradingChart}> </div> )
   
}

export default TradingChart




