import React, {useEffect, useRef, useState, useMemo} from 'react';
import './index.css';
import { widget } from '../../charting_library';
import { Multiselect } from 'multiselect-react-dropdown';
import { parseInt } from 'lodash';
import * as Constants from '../Queries';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
var bigDecimal = require('js-big-decimal');

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
	const latestKlineTime = useRef(0)
	const currentKlineData = useRef({})

	const datafeedMemo = useMemo(() => {
		const cache = new InMemoryCache();

  	const client = new ApolloClient({
		cache: cache,
		uri: 'https://graphql.bitquery.io',
		headers:{'X-API-KEY':process.env.REACT_APP_BQAPI},
		name: 'chart-client',
		version: '1.3',
		queryDeduplication: false,
		shouldBatch: true,
  	})


  const lastBarsCache = new Map();

const configurationData = {
    supported_resolutions: 
    ['1', '5','10', '15', '30', '60','1D', '1W'],
    supports_search: false,
   
   }
		return {
			onReady: (callback) => {
				console.log('[onReady]: Method call');
				
				setTimeout(() => callback(configurationData));
			},
			resolveSymbol: async (
				symbol,
				onSymbolResolvedCallback,
				onResolveErrorCallback
			) => {
			  try{
		
				const parsedTokenInfo = JSON.parse(symbol)
				console.log('[resolveSymbol]: Method call', parsedTokenInfo.TokenSymbol);
				let symbolInfo;
				if (parsedTokenInfo.tokenAddress.toLowerCase() == "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c".toLowerCase()){
				  symbolInfo = {
					ticker: `${parsedTokenInfo.TokenSymbol}/USD`,
					name: `${parsedTokenInfo.TokenSymbol}/USD`,
					tokenAddress:parsedTokenInfo.tokenAddress,
					description:`${parsedTokenInfo.TokenSymbol}/USD`,
					type: 'crypto',
					session: '24x7',
					timezone: 'Etc/UTC',
					exchange:'diamondcharts.app',
					has_intraday: true,
					has_ticks: true,
					minmov: 2,
					pricescale: 100,
					has_no_volume: false,
					has_weekly_and_monthly: true,
					supported_resolutions: configurationData.supported_resolutions,
					volume_precision: 2,
					exchanges:[...parsedTokenInfo.exchanges]
				}
				}else{
				  var m = -Math.floor( Math.log10(new bigDecimal(parsedTokenInfo.TokenPrice).getValue()) + 1)
				  const max = parsedTokenInfo.lpaddress.reduce(function(prev, current) {
					return (prev.BalanceOfPair > current.BalanceOfPair) ? prev : current
				}) //returns object
				  symbolInfo = {
					ticker: `${parsedTokenInfo.TokenSymbol}/${max.type}`,
					name: `${parsedTokenInfo.TokenSymbol}/${max.type}`,
					tokenAddress:parsedTokenInfo.tokenAddress,
					description:`${parsedTokenInfo.TokenSymbol}/${max.type}`,
					type: 'crypto',
					session: '24x7',
					timezone: 'Etc/UTC',
					exchange:'diamondcharts.app',
					minmov: 1,
					largestLP:max,
					pricescale: parseInt(`1${"0".repeat(m+ 4)}`),     
					has_intraday: true,
					has_daily: true,
					has_weekly_and_monthly: true,
					has_no_volume: false,
					currency_code:'USD',
					supported_resolutions: configurationData.supported_resolutions,
					volume_precision: 2,
					exchanges:[...parsedTokenInfo.exchanges]
				};
				
				}
				console.log('[resolveSymbol]: Symbol resolved', parsedTokenInfo.TokenSymbol);
				setTimeout(() => {
				onSymbolResolvedCallback(symbolInfo);
				}, 0);
			  }catch(e){
				console.log(e);
			  }
		
		
				
		
			   
			},
			getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
		
				const { from, to, firstDataRequest } = periodParams;
				let interval;
				switch(resolution) {
						case '1':
							interval = 1
						  break;
						case '5':
							interval = 5
						  break;
						case '15':
							interval = 15
						  break;
						case '10':
							interval = 10
						break;
						case '30':
							interval = 30
						  break;
						case '60':
							interval = 60
						  break;
						case '1D':
							interval = 1440
						  break;
						case '1W':
							interval = 10080
						  break;
						default:
							interval = 15
					  }
				
				try {
			  
					console.log('[getBars]: Method call', interval, new Date(from * 1000), new Date(to * 1000));

	
					 // Gets Bars for None BNB tokens
					  if (symbolInfo.tokenAddress.toLowerCase() != "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c".toLowerCase()){					
						const response = await client.query({
						  query: Constants.GET_CHART_DATA,
						  variables:{
							"baseCurrency": symbolInfo.tokenAddress,
							"quoteCurrency": symbolInfo.largestLP.typeAddress,
							"since": new Date(from * 1000).toISOString(),
							"till": new Date(to * 1000).toISOString(), //lastBarsCache.size > 0 ? new Date(lastBarsCache.get('bars')[0].time).toISOString() : new Date(to * 1000).toISOString(),
							"window": Number(interval),
							"exchangeAddresses": symbolInfo.exchanges,
							"minTrade": 10
						  }
						})


		
						const res = await client.query({
							query: Constants.GET_CHART_DATA,
							variables:{
							  "baseCurrency": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
							  "quoteCurrency": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
							  "since": new Date(from * 1000).toISOString(),
							  "till": new Date(to * 1000).toISOString(), //lastBarsCache.size > 0 ? new Date(lastBarsCache.get('bars')[0].time).toISOString() : new Date(to * 1000).toISOString(),
							  "window": Number(interval),
							  "exchangeAddresses": symbolInfo.exchanges,
							  "minTrade": 10
							}
						  })
		
						if (typeof response.data.ethereum == 'object') {
						  
						  let result = res.data.ethereum.dexTrades.filter(o1 => 
							{
							  return response.data.ethereum.dexTrades.some(o2 => {
							   return new Date(o1.timeInterval.minute).getTime() === new Date(o2.timeInterval.minute).getTime()
							  })
							
							});

							let bars = [];
					
					  
						  if (typeof res.data.ethereum.dexTrades == 'object') {

		
							response.data.ethereum.dexTrades.forEach((el, i) => {
								if (new Date(el.timeInterval.minute).getTime() >= from* 1000 && new Date(el.timeInterval.minute).getTime() < to* 1000) {
									if(symbolInfo.largestLP.typeAddress.toLowerCase() == "0xe9e7cea3dedca5984780bafc599bd69add087d56".toLowerCase()){
									if(i == 0){
									  bars = [...bars,{
										time: new Date(el.timeInterval.minute).getTime(), 
										low: new bigDecimal(new bigDecimal(el.minimum_price).getValue() ).getValue(),
										high: new bigDecimal(new bigDecimal(el.maximum_price).getValue()).getValue(),
										open: new bigDecimal(new bigDecimal(el.open_price).getValue()).getValue(), 
										close: new bigDecimal(new bigDecimal(el.close_price).getValue()).getValue(),  
										volume: el.tradeAmount,
									  }]

									}else{
									bars =[...bars,{
									time: new Date(el.timeInterval.minute).getTime(), 
									low: new bigDecimal(new bigDecimal(el.minimum_price).getValue() ).getValue(),
									high: new bigDecimal(new bigDecimal(el.maximum_price).getValue()).getValue(),
									open: new bigDecimal(new bigDecimal(response.data.ethereum.dexTrades[i-1]['close_price']).getValue()).getValue(), 
									close: new bigDecimal(new bigDecimal(el.close_price).getValue()).getValue(),  
									volume: el.tradeAmount,
								  }]
									}
			  
									
									
								  }
								  else{
									if(i == 0){
										bars =[...bars,{
										  time: new Date(el.timeInterval.minute).getTime(), 
										  low: new bigDecimal(new bigDecimal(el.minimum_price).getValue() * res.data.ethereum.dexTrades[i].minimum_price).getValue(),
										  high: new bigDecimal(new bigDecimal(el.maximum_price).getValue() * res.data.ethereum.dexTrades[i].maximum_price).getValue(),
										  open: new bigDecimal(new bigDecimal(el.open_price).getValue() * res.data.ethereum.dexTrades[i].open_price).getValue(), 
										  close: new bigDecimal(new bigDecimal(el.close_price).getValue() * res.data.ethereum.dexTrades[i].close_price).getValue(),  
										  volume: el.tradeAmount,
										}]
										
									}else{
										bars = [...bars,{
									  time: new Date(el.timeInterval.minute).getTime(), 
									  low: new bigDecimal(new bigDecimal(el.minimum_price).getValue() * result[i].minimum_price).getValue(),
									  high: new bigDecimal(new bigDecimal(el.maximum_price).getValue() * result[i].maximum_price).getValue(),
									  open: new bigDecimal(new bigDecimal(response.data.ethereum.dexTrades[i-1]['close_price']).getValue() 
										* result[i-1]['close_price']).getValue(), 
									  close: new bigDecimal(new bigDecimal(el.close_price).getValue() * result[i].close_price).getValue(),  
									  volume: el.tradeAmount,
									}]
									}
			
								
									
								}
								}

								
							});

							if (bars.length === 0) {
								console.log('No Bar Found');
								onHistoryCallback([], { noData: true });
								return;
							}


							console.log(`[getBars]: returned ${bars.length} bar(s)`);
							onHistoryCallback(bars, { noData: false });
							
							
		
						  }
		
		
					  
		
						}
		
					  }
					 	
					  // Gets Bars for BNB
					  else{
		
				  
						  const res = await client.query({
							query: Constants.GET_CHART_DATA,
							variables:{
							  "baseCurrency": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
							  "quoteCurrency": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
							  "since": new Date(from * 1000).toISOString(),
							  "till": new Date(to * 1000).toISOString(), //lastBarsCache.size > 0 ? new Date(lastBarsCache.get('bars')[0].time).toISOString() : new Date(to * 1000).toISOString(),
							  "window": Number(interval),
							  "exchangeAddresses": symbolInfo.exchanges,
							  "minTrade": 10
							}
						  })
						  let bars = [];
		
						  if (typeof res.data.ethereum.dexTrades == 'object') {
		
							bars = res.data.ethereum.dexTrades.map((el,i) => {
							  if(i == 0){
								return ({
								  time: new Date(el.timeInterval.minute).getTime(), 
								  low: el.minimum_price,
								  high: el.maximum_price,
								  open: el.open_price , 
								  close: Number(el.close_price), 
								  volume: el.tradeAmount,
								})
							  }
							  return ({
							  time: new Date(el.timeInterval.minute).getTime(), 
							  low: el.minimum_price,
							  high: el.maximum_price,
							  open: res.data.ethereum.dexTrades[i-1]['close_price'] , 
							  close: Number(el.close_price), 
							  volume: el.tradeAmount,
							})
						  })
						  console.log(`[getBars]: returned ${bars.length} bar(s)`);
						  onHistoryCallback(bars, { noData: false });
						  }
						
					  }
			  


					/* 
						const roundDownTo = roundTo => x => Math.floor(x / roundTo) * roundTo;
						const roundDownToXMinutes = roundDownTo(1000 * 60 * interval);
						var date = new Date();
						const msDown = roundDownToXMinutes(date)
						var cdate = new Date(msDown);
						const numofBars = Math.abs(cdate.getTime() - allSwaps.current[allSwaps.current.length - 1].blockData.timestamp) % (1000 * 60 * interval)
						console.log(numofBars)
						const d = allSwaps.current.filter(swap =>{
							// Check for swaps for each Kline
						});
					*/
					
				  } catch (err) {
					console.log({ err })
					onErrorCallback(err)
				  }

				  
		
			},
			subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
				console.group('subscribeBars')
				console.log(symbolInfo);
				console.log('[subscribeBars]: Method call with subscribeUID:', subscribeUID);
				console.groupEnd()
				

			},
			unsubscribeBars: (subscriberUID) => {
				console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
			},
			getMarks: (symbolInfo, from, to, onDataCallback, resolution)=> {
			  console.log(symbolInfo);
		  },
		
		}
	}, [props.tokenDetails.tokenAddress, ExchangesSelected, rendercount])

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
			datafeed: datafeedMemo,
			interval: interval.current,
			container: props.containerId,
			library_path: props.libraryPath,
			interval: interval.current,
			locale: getLanguageFromURL() || 'en',
			disabled_features: ['header_symbol_search','timezone_menu'],
			enabled_features: ['study_templates','use_localstorage_for_settings'],
			charts_storage_url: props.chartsStorageUrl,
			charts_storage_api_version: props.chartsStorageApiVersion,
			client_id: props.clientId,
			user_id: props.userId,
			fullscreen: props.fullscreen,
			autosize: props.autosize,
			studies_overrides: props.studiesOverrides,
			theme:'Dark',
		};

		const tvWidgetConst = new widget(widgetOptions);
		tvWidget = tvWidgetConst;
		
		tvWidget.onChartReady(() => {
			
			
			tvWidget.activeChart().onIntervalChanged().subscribe(null,
				(interval, timeframeObj) => {
					if (interval == 5) {
						const cdate = new Date()
					widget.activeChart().setVisibleRange(
						{ from: cdate.getUTCSeconds()-86400, to: cdate.getUTCSeconds() },
						{ percentRightMargin: 20 }
					).then(() => console.log('New visible range is applied'));
					}
					
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
		filtedSwaps.current = props.swaps;
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


