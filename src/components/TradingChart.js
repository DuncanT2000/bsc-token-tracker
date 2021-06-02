import React, {useState, useEffect, useRef} from 'react'
import { createChart } from 'kaktana-react-lightweight-charts'


let chart;
let candlestickSeries= null;

const TradingChart = (props) => {
    
  const tradingChart = useRef()

  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    chart = createChart(tradingChart.current, { 
      autoWidth:true,
      autoHeight:true,
      darkTheme:true,
      timeScale: {
        rightOffset: 12,
        barSpacing: 3,
        fixLeftEdge: true,
        lockVisibleTimeRangeOnResize: true,
        rightBarStaysOnScroll: false,
        borderVisible: false,
        borderColor: "#fff000",
        visible: true,
        timeVisible: true,
        secondsVisible: false
      }
     });
    candlestickSeries = chart.addCandlestickSeries();
    
  }, []);


  useEffect(() => {
    
    const init = async()=>{
      
      if (props.candleDataArr.length > 0) {
        candlestickSeries.setData(props.candleDataArr)
      setisLoading(false)
      }else{

      }
      
      
 
      
    }
    init()
  }, [props.candleDataArr])


    return(<div>
      {isLoading ==true ? <p>Loading Chart Data...</p> : <></>}
      <div className="trading-chart" ref={tradingChart}> </div>
      </div>)

  
    
  
}

export default TradingChart