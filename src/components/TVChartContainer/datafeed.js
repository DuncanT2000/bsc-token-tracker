import { parseInt } from 'lodash';
import { makeApiRequest } from './helper.js';


  import axios from 'axios'
  import * as Constants from '../Queries';

  import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { logDOM } from '@testing-library/react';
var bigDecimal = require('js-big-decimal');

  const cache = new InMemoryCache();

  const client = new ApolloClient({
  cache: cache,
  uri: 'https://graphql.bitquery.io',
  headers:{'X-API-KEY':process.env.REACT_APP_BQAPI},
  name: 'chart-client',
  version: '1.3',
  queryDeduplication: false,
  })


  const lastBarsCache = new Map();

const configurationData = {
    supported_resolutions: 
    ['1', '5','10', '15', '30', '60','1D', '1W'],
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
      try{

        const parsedTokenInfo = JSON.parse(symbol)
        console.log('[resolveSymbol]: Method call', parsedTokenInfo.TokenSymbol);
        console.log(parsedTokenInfo);
        let symbolInfo;
        if (parsedTokenInfo.tokenAddress == "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"){
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
            minmov: 1,
            pricescale: 100,
            has_no_volume: true,
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
            ticker: `${parsedTokenInfo.TokenSymbol}/BNB`,
            name: `${parsedTokenInfo.TokenSymbol}/BNB`,
            tokenAddress:parsedTokenInfo.tokenAddress,
            description:`${parsedTokenInfo.TokenSymbol}/BNB`,
            type: 'crypto',
            session: '24x7',
            timezone: 'Etc/UTC',
            exchange:'diamondcharts.app',
            minmov: 1,
            largestLP:max,
            pricescale: parseInt(`1${"0".repeat(m+ 4)}`),     
            has_intraday: true,
            has_weekly_and_monthly: true,
            has_no_volume: true,
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
        console.log('[getBars]: Method call', interval, new Date(0).setUTCSeconds(from), new Date(0).setUTCSeconds(to));

        try {
      
            let bars = [];

            if (!firstDataRequest){
              if (symbolInfo.tokenAddress != "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"){

                const response = await client.query({
                  query: Constants.GET_CHART_DATA,
                  variables:{
                    "baseCurrency": symbolInfo.tokenAddress,
                    "quoteCurrency": symbolInfo.largestLP.typeAddress,
                    "since": new Date(from * 1000).toISOString(),
                    "till": new Date(lastBarsCache.get('bars')[0].time).toISOString(),
                    "window": Number(interval),
                    "exchangeAddresses": symbolInfo.exchanges,
                    "minTrade": 10
                  }
                })
          
                if (typeof response.data.ethereum == 'object' && response.data.ethereum.dexTrades.length > 0) {
                  // get WBNB to BUSD price
                  console.log('Token klines were fetched, now getting BNB price')
                  const res = await client.query({
                    query: Constants.GET_CHART_DATA,
                    variables:{
                      "baseCurrency": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
                      "quoteCurrency": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
                      "since": new Date(from * 1000).toISOString(),
                      "till": new Date(to * 1000).toISOString(),
                      "window": Number(interval),
                      "exchangeAddresses": symbolInfo.exchanges,
                      "minTrade": 10
                    }
                  })
          

                  if (typeof res.data.ethereum.dexTrades == 'object') {
                    bars = response.data.ethereum.dexTrades.map((el,i) => {
                      return ({
                      time: new Date(el.timeInterval.minute).getTime(), 
                      low: new bigDecimal(new bigDecimal(el.minimum_price).getValue() * res.data.ethereum.dexTrades[i].quotePrice).getValue(),
                      high: new bigDecimal(new bigDecimal(el.maximum_price).getValue() * res.data.ethereum.dexTrades[i].quotePrice).getValue(),
                      open: new bigDecimal(new bigDecimal(el.open_price).getValue() * res.data.ethereum.dexTrades[i].open_price).getValue(), 
                      close: new bigDecimal(new bigDecimal(el.close_price).getValue() * res.data.ethereum.dexTrades[i].close_price).getValue(),  
                    })})
                  }
                }
                

              }else{
                console.log('Chart is BNB-BUSD');
                
                console.log('last bar:');
                console.log( new Date(lastBarsCache.get('bars')[0].time).toISOString());
        
                const res = await client.query({
                  query: Constants.GET_CHART_DATA,
                  variables:{
                    "baseCurrency": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
                    "quoteCurrency": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
                    "since": new Date(from * 1000).toISOString(),
                    "till": new Date(lastBarsCache.get('bars')[0].time).toISOString(),
                    "window": Number(resolution),
                    "exchangeAddresses": symbolInfo.exchanges,
                    "minTrade": 10
                  }
                })
          

              
                  if (typeof res.data.ethereum.dexTrades == 'object') {
                    bars = res.data.ethereum.dexTrades.map((el,i) => {
                      return ({
                      time: new Date(el.timeInterval.minute).getTime(), 
                      low: el.minimum_price,
                      high: el.maximum_price,
                      open: Number(el.open_price) , 
                      close: Number(el.close_price), 
                    })})
                  }
                
              

              }

            }
            // The else statement will run if its the first request
            else{

              if (symbolInfo.tokenAddress != "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"){

                console.log(`Getting ${symbolInfo.name} Candles`);

                const response = await client.query({
                  query: Constants.GET_CHART_DATA,
                  variables:{
                    "baseCurrency": symbolInfo.tokenAddress,
                    "quoteCurrency": symbolInfo.largestLP.typeAddress,
                    "since": new Date(from * 1000).toISOString(),
                    "till": new Date(to * 1000).toISOString(),
                    "window": Number(interval),
                    "exchangeAddresses": symbolInfo.exchanges,
                    "minTrade": 10
                  }
                })


                if (typeof response.data.ethereum == 'object' && response.data.ethereum.dexTrades.length > 0) {
                  // get WBNB to BUSD price
                  console.log('Token klines were fetched, now getting BNB price')
                  const res = await client.query({
                    query: Constants.GET_CHART_DATA,
                    variables:{
                      "baseCurrency": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
                      "quoteCurrency": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
                      "since": new Date(from * 1000).toISOString(),
                      "till": new Date(to * 1000).toISOString(),
                      "window": Number(interval),
                      "exchangeAddresses": symbolInfo.exchanges,
                      "minTrade": 10
                    }
                  })
          

              
                  if (typeof res.data.ethereum.dexTrades == 'object') {
                    console.log('From: ' + from);
                    console.log('To: ' + to);
                    
                    bars = response.data.ethereum.dexTrades.map((el,i) => {
                      return ({
                      time: new Date(el.timeInterval.minute).getTime(), 
                      low: new bigDecimal(new bigDecimal(el.minimum_price).getValue() * res.data.ethereum.dexTrades[i].quotePrice).getValue(),
                      high: new bigDecimal(new bigDecimal(el.maximum_price).getValue() * res.data.ethereum.dexTrades[i].quotePrice).getValue(),
                      open: new bigDecimal(new bigDecimal(el.open_price).getValue() * res.data.ethereum.dexTrades[i].open_price).getValue(), 
                      close: new bigDecimal(new bigDecimal(el.close_price).getValue() * res.data.ethereum.dexTrades[i].close_price).getValue(),  
                    })})

                  }

                  console.log('Bars have been created');

              

                }

              }else{

                console.log('First Chart is BNB-BUSD');
          
                  const res = await client.query({
                    query: Constants.GET_CHART_DATA,
                    variables:{
                      "baseCurrency": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
                      "quoteCurrency": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
                      "since": new Date(from * 1000).toISOString(),
                      "till": new Date(to * 1000).toISOString(),
                      "window": Number(interval),
                      "exchangeAddresses": symbolInfo.exchanges,
                      "minTrade": 10
                    }
                  })

                  if (typeof res.data.ethereum.dexTrades == 'object') {
                    console.log('From: ' + from);
                    console.log('To: ' + to);
                    bars = res.data.ethereum.dexTrades.map((el,i) => {
                      return ({
                      time: new Date(el.timeInterval.minute).getTime(), 
                      low: el.minimum_price,
                      high: el.maximum_price,
                      open: Number(el.open_price) , 
                      close: Number(el.close_price), 
                    })})
                  }
                
              }


            }
      
            console.log(bars);
      
            if (bars.length) {
              lastBarsCache.set('bars', bars)
              onHistoryCallback(bars, { noData: false })
            } else {
              onHistoryCallback(bars, { noData: true })
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
    getMarks: (symbolInfo, from, to, onDataCallback, resolution)=> {
      console.log(symbolInfo);
  },

};
