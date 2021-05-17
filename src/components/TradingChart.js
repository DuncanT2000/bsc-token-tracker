import React, {useState, useEffect, useRef} from 'react'
import {createChart} from 'lightweight-charts'



let chart;
let candlestickSeries= null;

const TradingChart = (props) => {
    
  const tradingChart = useRef()

  const [isLoading, setisLoading] = useState(true);
  const [isLoadingChartData, setisLoadingChartData] = useState(false);

  useEffect(() => {
    chart = createChart(tradingChart.current, { 
      autoHeight:true,
      autoWidth: true,
      darkTheme:true,
      localization: {
        priceFormatter: price =>
            '$' + parseFloat(price) > 0.00000 ? parseFloat(price).toFixed(4) : parseFloat(price).toFixed(8)
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
  },});
    candlestickSeries = chart.addCandlestickSeries();

    function onVisibleLogicalRangeChanged(newVisibleLogicalRange) {
      const barsInfo = candlestickSeries.barsInLogicalRange(newVisibleLogicalRange);

      

      if (isLoadingChartData) {
        return
      }
      if (barsInfo !== null && barsInfo.barsBefore < 50) {

        return
          
      }
     console.log(isLoadingChartData);
 
  }
      chart.timeScale().subscribeVisibleLogicalRangeChange(onVisibleLogicalRangeChanged);

  }, []);


  useEffect( () => {
    const init = async()=>{
      if(props.bnbPrice == undefined) return
      candlestickSeries.setData(props.candleDataArr)
      setisLoading(false)
    }
    init()
  }, [props.candleDataArr])


    
    return(<div>
      {isLoading ==true ? <p>Loading Chart Data...</p> : <> </>}
      <div className="trading-chart" ref={tradingChart}> </div>
      </div>)

  
    
  
}

export default TradingChart