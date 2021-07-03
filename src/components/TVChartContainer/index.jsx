import React, {useEffect, useRef, useState} from 'react';
import './index.css';
import { widget } from '../../charting_library';

import datafeed from './datafeed'
import { Multiselect } from 'multiselect-react-dropdown';

let tvWidget;

function getLanguageFromURL() {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export const TVChartContainer = (props) => {
	
	const [SelectedDropExchanges, setSelectedDropExchanges] = useState([]);
    const [ExchangesSelected, setExchangesSelected] = useState([]);
	const [rendercount, setrendercount] = useState(1);
	const interval = useRef(localStorage.getItem('tradingview.chart.lastUsedTimeBasedResolution') || '15')
	const allSwaps = useRef([])
	const filtedSwaps = useRef([])

	useEffect(() => {
		const exchanges = []
		ExchangesSelected.length == 0 
		? 
		exchanges.push("0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73")
		:
		exchanges.push(...ExchangesSelected)
		console.log(exchanges);
		const chartDetails = {...props.tokenDetails, exchanges: exchanges}
		const widgetOptions = {
			symbol:  JSON.stringify(chartDetails),
			// BEWARE: no trailing slash is expected in feed UR
			datafeed: datafeed,
			interval: props.interval,
			container_id: props.containerId,
			library_path: props.libraryPath,
			interval: interval.current,
			locale: getLanguageFromURL() || 'en',
			disabled_features: ['use_localstorage_for_settings','header_symbol_search'],
			enabled_features: ['study_templates'],
			charts_storage_url: props.chartsStorageUrl,
			charts_storage_api_version: props.chartsStorageApiVersion,
			client_id: props.clientId,
			user_id: props.userId,
			fullscreen: props.fullscreen,
			autosize: props.autosize,
			studies_overrides: props.studiesOverrides,
			theme:'Dark',
			overrides: {
				"paneProperties.background": "#131722",
				"paneProperties.vertGridProperties.color": "#363c4e",
				"paneProperties.horzGridProperties.color": "#363c4e",
				"symbolWatermarkProperties.transparency": 90,
				"scalesProperties.textColor" : "#AAA",
				"mainSeriesProperties.candleStyle.wickUpColor": '#336854',
				"mainSeriesProperties.candleStyle.wickDownColor": '#7f323f',
			   }
		};

		const tvWidgetConst = new widget(widgetOptions);
		tvWidget = tvWidgetConst;
		
		tvWidget.onChartReady(() => {
			
			
			tvWidget.activeChart().onIntervalChanged().subscribe(null,
				(interval, timeframeObj) => {
					tvWidget.chart().setResolution(interval)
					interval.current = interval
				}
			);

		
		});
		return () => {
			if (tvWidget !== null) {
				tvWidget.remove();
				tvWidget = null;
			}
		}
	}, [props.tokenDetails.tokenAddress, ExchangesSelected, rendercount])

	useEffect(() => {
		allSwaps.current = props.swaps;
	}, [props.swaps]);

	const onSelect = (selectedList, selectedItem) =>{
		setSelectedDropExchanges(selectedList)
		setExchangesSelected(selectedList.map((e)=>e.value))
	  }
	  const onRemove = (selectedList, removedItem) =>{
		setSelectedDropExchanges(selectedList)
		setExchangesSelected(selectedList.map((e)=>e.value))
	  }

	return (
		<div className="chart-container">


		<div className="chart-option-bar">
			<button onClick={()=>setrendercount(p=> p+1)}>Reload!</button>
		<Multiselect
              options={[
                { id: 1, value: "0xBCfCcbde45cE874adCB698cC183deBcF17952812", name:"PsV1" },
                { id: 2, value: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73" , name:"PsV2" },
              ]}
              labelledBy="Select Exchanges"
              selectedValues={SelectedDropExchanges}
              onSelect={onSelect}
              onRemove={onRemove}    
              displayValue="name"
              style={{
                width:'25%'
              }}
              />
		</div>
		<div
		id={ props.containerId }
		className={ 'TVChartContainer' }
		/>
		</div>
	)
}


