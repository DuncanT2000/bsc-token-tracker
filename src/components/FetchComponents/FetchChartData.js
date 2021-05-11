import React from 'react'

const FetchChartData = async (tokenAddress,interval, bnbPrice) => {

    
    var myHeaders = new Headers();
myHeaders.append("Content-Type", "text/plain");
myHeaders.append("Cookie", "__cfduid=d0cc20f07e2545c62339e9d2a3f6578061620497581");

const date = new Date()
const currentdate = `${date.getFullYear()}-${date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth()}-${ date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}T${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:${date.getMinutes() < 10 && date.getMinutes() > 5  ? "0" + date.getMinutes() - 1 : date.getMinutes()-5 }:00.000Z`


const bcoin = tokenAddress

const queryJSON = {
  "query":'query GetCandleData(  $baseCurrency: String!,  $since: ISO8601DateTime,  $till: ISO8601DateTime,  $quoteCurrency: String!,  $exchangeAddresses: [String!]  $minTrade: Float  $window: Int) {    ethereum(network: bsc) {        dexTrades( options: {asc: "timeInterval.minute"}          date: {since: $since, till: $till}           exchangeAddress: {in: $exchangeAddresses} baseCurrency: {is: $baseCurrency}           quoteCurrency: {is: $quoteCurrency}       tradeAmountUsd: {gt: $minTrade}        ) {            timeInterval {                minute(count: $window, format:"%Y-%m-%dT%H:%M:%SZ")            }        baseCurrency {symbol address} quoteCurrency {               symbol                address            }           tradeAmount(in: USD)           trades: count            quotePrice           maximum_price: quotePrice(calculate: maximum)minimum_price: quotePrice(calculate: minimum)open_price: minimum(of: block, get: quote_price) close_price: maximum(of: block, get: quote_price)}}',
  "variables":{"baseCurrency": bcoin,
  "quoteCurrency": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
  "since": "2021-04-23T10:40:00.000Z",
  "till":"2021-05-08T18:10:00.000Z",
  "window": interval,        
  "exchangeAddresses": ["0xbcfccbde45ce874adcb698cc183debcf17952812"],        
  "minTrade": 10    }
}


var raw = `{\r\n    \"query\": \"query GetCandleData(\\n  $baseCurrency: String!,\\n  $since: ISO8601DateTime,\\n  $till: ISO8601DateTime,\\n  $quoteCurrency: String!,\\n  $exchangeAddresses: [String!]\\n  $minTrade: Float\\n  $window: Int) {\\n    ethereum(network: bsc) {\\n        dexTrades(\\n            options: {asc: \\\"timeInterval.minute\\\"}\\n            date: {since: $since, till: $till}\\n            exchangeAddress: {in: $exchangeAddresses}\\n            baseCurrency: {is: $baseCurrency}\\n            quoteCurrency: {is: $quoteCurrency} # WBNB\\n            tradeAmountUsd: {gt: $minTrade}\\n        ) {\\n            timeInterval {\\n                minute(count: $window, format: \\\"%Y-%m-%dT%H:%M:%SZ\\\")\\n            }\\n            baseCurrency {\\n                symbol\\n                address\\n            }\\n            quoteCurrency {\\n                symbol\\n                address\\n            }\\n\\n            tradeAmount(in: USD)\\n            trades: count\\n            quotePrice\\n            maximum_price: quotePrice(calculate: maximum)\\n            minimum_price: quotePrice(calculate: minimum)\\n            open_price: minimum(of: block, get: quote_price)\\n            close_price: maximum(of: block, get: quote_price)\\n        }\\n    }\\n}\\n\",\r\n    \"variables\": {\r\n        \"baseCurrency\": \"${bcoin}\",\r\n        \"quoteCurrency\": \"0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c\",\r\n        \"since\": \"2021-04-23T10:40:00.000Z\",\r\n        \"till\": \"2021-05-08T18:10:00.000Z\",\r\n        \"window\": ${interval},\r\n        \"exchangeAddresses\": [\r\n            \"0xbcfccbde45ce874adcb698cc183debcf17952812\"\r\n        ],\r\n        \"minTrade\": 10\r\n    }\r\n}`


var requestOptions = {
method: 'POST',
headers: myHeaders,
body:raw,
redirect: 'follow'
};
const chartData = await fetch("https://chartdata.poocoin.app/", requestOptions)
.then(response => response.json())
.then(result => {
  let cdata
  if(result.data.ethereum.dexTrades == [] || result.data.ethereum.dexTrades == undefined){
    cdata = []
  }else{
      cdata = result.data.ethereum.dexTrades.map((item)=>{
  return{
  "time":new Date(item.timeInterval.minute).getTime() / 1000 + 900 + 330*60,
  "open": bnbPrice * parseFloat(item.open_price),
  "high": bnbPrice * parseFloat(item.maximum_price),
  "low": bnbPrice * parseFloat(item.minimum_price),
  "close": bnbPrice * parseFloat(item.close_price),
  "volume": item.tradeAmount
}
})
  }

return cdata
})

return chartData

}

export default FetchChartData
