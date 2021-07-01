import React, {useEffect, useMemo, useRef} from 'react';
import './index.css';
import { widget } from '../../charting_library';

import datafeed from './datafeed'

let tvWidget;

function getLanguageFromURL() {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export const TVChartContainer = (props) => {
	
	useMemo(() => {}, datafeed)

	const interval = useRef(localStorage.getItem('tradingview.chart.lastUsedTimeBasedResolution') || '15')
	

	useEffect(() => {
		const exchanges = []
		props.ExchangesSelected.length == 0 
		? 
		exchanges.push("0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73")
		:
		exchanges.push(...props.ExchangesSelected)
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
			
			tvWidget.activeChart().onDataLoaded().subscribe(null,
				() => {
					console.log('Data loaded');
					tvWidget.mainSeriesPriceFormatter()._pricescale = 10 ^ 20
					console.log(tvWidget.mainSeriesPriceFormatter());
				}
			);

		
		});
		return () => {
			if (tvWidget !== null) {
				tvWidget.remove();
				tvWidget = null;
			}
		}
	}, [props.tokenDetails.tokenAddress, props.ExchangesSelected])


	return (
		<div
		id={ props.containerId }
		className={ 'TVChartContainer' }
		/>
	)
}


