import { parseInt } from 'lodash';
import { makeApiRequest } from './helper.js';


  import axios from 'axios'
  import * as Constants from '../Queries';

  const lastBarsCache = new Map();

const configurationData = {
    supported_resolutions: 
    ['1', '5', '15', '30', '60','1D', '1W'],
    supports_search: false,
   
   }

export default {
    onReady: (callback) => {
        console.log('[onReady]: Method call');
        
        setTimeout(() => callback(configurationData));
    },
    resolveSymbol: async (
        symbol,
        onSymbolResolvedCallback,
        onResolveErrorCallback
    ) => {
      const parsedTokenInfo = JSON.parse(symbol)
        console.log('[resolveSymbol]: Method call', parsedTokenInfo.TokenSymbol);
        
        const symbolInfo = {
            ticker: parsedTokenInfo.TokenName,
            name: parsedTokenInfo.TokenSymbol,
            tokenAddress:parsedTokenInfo.tokenAddress,
            description: '',
            type: 'crypto',
            session: '24x7',
            timezone: 'Etc/UTC',
            minmov: 1,
            has_intraday: true,
            has_no_volume: true,
            has_weekly_and_monthly: true,
            supported_resolutions: configurationData.supported_resolutions,
            volume_precision: 2,
            exchanges:[...parsedTokenInfo.exchanges]
        };

        console.log('[resolveSymbol]: Symbol resolved', 'DOT');
        onSymbolResolvedCallback(symbolInfo);
    },
    getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
        const { from, to, firstDataRequest } = periodParams;
        console.log(symbolInfo);
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
        console.log('[getBars]: Method call', interval, new Date(from), new Date(to));

        try {

            if (resolution === '1D') resolution = 1440
            if (resolution === '1W') resolution = 10080
      
            if (!firstDataRequest){
              if (symbolInfo.tokenAddress != "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"){

                const response = await axios.post(
                  Constants.GRAPHQL_API, {
                  query: Constants.GET_CHART_DATA,
                  variables: 
                  {
                    "baseCurrency": symbolInfo.tokenAddress,
                    "quoteCurrency": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
                    "since": new Date(from * 1000).toISOString(),
                    "till": new Date(to * 1000).toISOString(),
                    "window": Number(resolution),
                    "exchangeAddresses": symbolInfo.exchanges,
                    "minTrade": 10
                  },
                  headers: {
                      "Content-Type": "application/json",
                      "X-API-KEY": "BQYwEholP8rzpCidmKzempTEEuF0WCwZ"
                    }
                })
          
                let bars = []
          
                if (typeof response.data.data.ethereum == 'object' && response.data.data.ethereum.dexTrades.length > 0) {
                  // get WBNB to BUSD price
          
                  const res = await axios.post(
                    Constants.GRAPHQL_API, {
                    query: Constants.GET_CHART_DATA,
                    variables: {
                      "baseCurrency": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
                      "quoteCurrency": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
                      "since": new Date(from * 1000).toISOString(),
                      "till": new Date(to * 1000).toISOString(),
                      "window": Number(resolution),
                      "exchangeAddresses": symbolInfo.exchanges,
                      "minTrade": 10
                    },
                    headers: {
                      "Content-Type": "application/json",
                      "X-API-KEY": "BQYwEholP8rzpCidmKzempTEEuF0WCwZ"
                    }
                  })
          

              
                  if (typeof res.data.data.ethereum.dexTrades == 'object') {
                    bars = response.data.data.ethereum.dexTrades.map((el,i) => {
                      return ({
                      time: new Date(el.timeInterval.minute).getTime(), 
                      low: el.minimum_price * res.data.data.ethereum.dexTrades[i].quotePrice,
                      high: el.maximum_price * res.data.data.ethereum.dexTrades[i].quotePrice,
                      open: Number(el.open_price) * res.data.data.ethereum.dexTrades[i].open_price, 
                      close: Number(el.close_price) * res.data.data.ethereum.dexTrades[i].close_price, 
                    })})
                  }
                }
                if (bars.length) {
                  onHistoryCallback(bars, { noData: false })
                } else {
                  onHistoryCallback(bars, { noData: true })
                }

              }else{

                console.log('Chart is BNB-BUSD');
          
                let bars = []
        
                  const res = await axios.post(
                    Constants.GRAPHQL_API, {
                    query: Constants.GET_CHART_DATA,
                    variables: {
                      "baseCurrency": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
                      "quoteCurrency": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
                      "since": new Date(from * 1000).toISOString(),
                      "till": new Date(to * 1000).toISOString(),
                      "window": Number(resolution),
                      "exchangeAddresses": symbolInfo.exchanges,
                      "minTrade": 10
                    },
                    headers: {
                      "Content-Type": "application/json",
                      "X-API-KEY": "BQYwEholP8rzpCidmKzempTEEuF0WCwZ"
                    }
                  })
          

              
                  if (typeof res.data.data.ethereum.dexTrades == 'object') {
                    bars = res.data.data.ethereum.dexTrades.map((el,i) => {
                      return ({
                      time: new Date(el.timeInterval.minute).getTime(), 
                      low: el.minimum_price,
                      high: el.maximum_price,
                      open: Number(el.open_price) , 
                      close: Number(el.close_price), 
                    })})
                  }
                
                if (bars.length) {
                  onHistoryCallback(bars, { noData: false })
                } else {
                  onHistoryCallback(bars, { noData: true })
                }

              }

            }else{

              if (symbolInfo.tokenAddress != "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"){

                const response = await axios.post(
                  Constants.GRAPHQL_API, {
                  query: Constants.GET_CHART_DATA,
                  variables: 
                  {
                    "baseCurrency": symbolInfo.tokenAddress,
                    "quoteCurrency": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
                    "since": new Date(from * 1000).toISOString(),
                    "till": new Date(to * 1000).toISOString(),
                    "window": Number(resolution),
                    "exchangeAddresses": symbolInfo.exchanges,
                    "minTrade": 10
                  },
                  headers: {
                      "Content-Type": "application/json",
                      "X-API-KEY": "BQYwEholP8rzpCidmKzempTEEuF0WCwZ"
                    }
                })
          
                let bars = []
          
                if (typeof response.data.data.ethereum == 'object' && response.data.data.ethereum.dexTrades.length > 0) {
                  // get WBNB to BUSD price
          
                  const res = await axios.post(
                    Constants.GRAPHQL_API, {
                    query: Constants.GET_CHART_DATA,
                    variables: {
                      "baseCurrency": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
                      "quoteCurrency": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
                      "since": new Date(from * 1000).toISOString(),
                      "till": new Date(to * 1000).toISOString(),
                      "window": Number(resolution),
                      "exchangeAddresses": symbolInfo.exchanges,
                      "minTrade": 10
                    },
                    headers: {
                      "Content-Type": "application/json",
                      "X-API-KEY": "BQYwEholP8rzpCidmKzempTEEuF0WCwZ"
                    }
                  })
          

              
                  if (typeof res.data.data.ethereum.dexTrades == 'object') {
                    bars = response.data.data.ethereum.dexTrades.map((el,i) => {
                      return ({
                      time: new Date(el.timeInterval.minute).getTime(), 
                      low: el.minimum_price * res.data.data.ethereum.dexTrades[i].quotePrice,
                      high: el.maximum_price * res.data.data.ethereum.dexTrades[i].quotePrice,
                      open: Number(el.open_price) * res.data.data.ethereum.dexTrades[i].open_price, 
                      close: Number(el.close_price) * res.data.data.ethereum.dexTrades[i].close_price, 
                    })})
                  }
                }
                if (bars.length) {
                  onHistoryCallback(bars, { noData: false })
                } else {
                  onHistoryCallback(bars, { noData: true })
                }

              }else{

                console.log('Chart is BNB-BUSD');
          
                let bars = []
        
                  const res = await axios.post(
                    Constants.GRAPHQL_API, {
                    query: Constants.GET_CHART_DATA,
                    variables: {
                      "baseCurrency": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
                      "quoteCurrency": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
                      "since": new Date(from * 1000).toISOString(),
                      "till": new Date(to * 1000).toISOString(),
                      "window": Number(resolution),
                      "exchangeAddresses": symbolInfo.exchanges,
                      "minTrade": 10
                    },
                    headers: {
                      "Content-Type": "application/json",
                      "X-API-KEY": "BQYwEholP8rzpCidmKzempTEEuF0WCwZ"
                    }
                  })
          

              
                  if (typeof res.data.data.ethereum.dexTrades == 'object') {
                    bars = res.data.data.ethereum.dexTrades.map((el,i) => {
                      return ({
                      time: new Date(el.timeInterval.minute).getTime(), 
                      low: el.minimum_price,
                      high: el.maximum_price,
                      open: Number(el.open_price) , 
                      close: Number(el.close_price), 
                    })})
                  }
                
                if (bars.length) {
                  onHistoryCallback(bars, { noData: false })
                } else {
                  onHistoryCallback(bars, { noData: true })
                }

              }

             

            }
            
      
      
            
          } catch (err) {
            console.log({ err })
            onErrorCallback(err)
          }
        

    },
    subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
        console.log('[subscribeBars]: Method call with subscribeUID:', subscribeUID);
    },
    unsubscribeBars: (subscriberUID) => {
        console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
    },
};