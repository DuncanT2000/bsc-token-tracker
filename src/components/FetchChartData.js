import React from 'react'

const FetchChartData = async (tokenAddress) => {

    console.log(tokenAddress);    
    
    var myHeaders = new Headers();
myHeaders.append("Content-Type", "text/plain");
myHeaders.append("Cookie", "__cfduid=d0cc20f07e2545c62339e9d2a3f6578061620497581");

const date = new Date()

const currentdate = `${date.getFullYear()}-${date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth()}-${ date.getDay() < 10 ? "0" + date.getDay() : date.getDay()}T${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes() }:${date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()}.000Z`
console.log(currentdate);
var rawBNBtoBUSD = `{\"query\":\"query GetCandleData(\\n  $baseCurrency: String!,\\n  $since: ISO8601DateTime,\\n  $till: ISO8601DateTime,\\n  $quoteCurrency: String!,\\n  $exchangeAddresses: [String!]\\n  $minTrade: Float\\n  $window: Int) {\\n    ethereum(network: bsc) {\\n        dexTrades(\\n            options: {asc: \\\"timeInterval.minute\\\"}\\n            date: {since: $since, till: $till}\\n            exchangeAddress: {in: $exchangeAddresses}\\n            baseCurrency: {is: $baseCurrency}\\n            quoteCurrency: {is: $quoteCurrency} # WBNB\\n            tradeAmountUsd: {gt: $minTrade}\\n        ) {\\n            timeInterval {\\n                minute(count: $window, format: \\\"%Y-%m-%dT%H:%M:%SZ\\\")\\n            }\\n            baseCurrency {\\n                symbol\\n                address\\n            }\\n            quoteCurrency {\\n                symbol\\n                address\\n            }\\n\\n            tradeAmount(in: USD)\\n            trades: count\\n            quotePrice\\n            maximum_price: quotePrice(calculate: maximum)\\n            minimum_price: quotePrice(calculate: minimum)\\n            open_price: minimum(of: block, get: quote_price)\\n            close_price: maximum(of: block, get: quote_price)\\n        }\\n    }\\n}\\n\",\"variables\":{\"baseCurrency\":\"0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c\",\"quoteCurrency\":\"0xe9e7cea3dedca5984780bafc599bd69add087d56\",\"since\":\"2021-05-06T11:50:00.000Z\",\"till\":\"2021-05-08T19:20:00.000Z\",\"window\":15,\"exchangeAddresses\":[\"0xbcfccbde45ce874adcb698cc183debcf17952812\"],\"minTrade\":10}}`.toString()


var requestOptionsBNBtoBUSD = {
method: 'POST',
headers: myHeaders,
body: rawBNBtoBUSD,
redirect: 'follow'
};

const data = await fetch("https://chartdata.poocoin.app/", requestOptionsBNBtoBUSD)
.then(response => response.json())
.then(async resultBNBtoBUSD => {
const bcoin = tokenAddress
var raw = `{\r\n    \"query\": \"query GetCandleData(\\n  $baseCurrency: String!,\\n  $since: ISO8601DateTime,\\n  $till: ISO8601DateTime,\\n  $quoteCurrency: String!,\\n  $exchangeAddresses: [String!]\\n  $minTrade: Float\\n  $window: Int) {\\n    ethereum(network: bsc) {\\n        dexTrades(\\n            options: {asc: \\\"timeInterval.minute\\\"}\\n            date: {since: $since, till: $till}\\n            exchangeAddress: {in: $exchangeAddresses}\\n            baseCurrency: {is: $baseCurrency}\\n            quoteCurrency: {is: $quoteCurrency} # WBNB\\n            tradeAmountUsd: {gt: $minTrade}\\n        ) {\\n            timeInterval {\\n                minute(count: $window, format: \\\"%Y-%m-%dT%H:%M:%SZ\\\")\\n            }\\n            baseCurrency {\\n                symbol\\n                address\\n            }\\n            quoteCurrency {\\n                symbol\\n                address\\n            }\\n\\n            tradeAmount(in: USD)\\n            trades: count\\n            quotePrice\\n            maximum_price: quotePrice(calculate: maximum)\\n            minimum_price: quotePrice(calculate: minimum)\\n            open_price: minimum(of: block, get: quote_price)\\n            close_price: maximum(of: block, get: quote_price)\\n        }\\n    }\\n}\\n\",\r\n    \"variables\": {\r\n        \"baseCurrency\": \"${bcoin}\",\r\n        \"quoteCurrency\": \"0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c\",\r\n        \"since\": \"2021-04-23T10:40:00.000Z\",\r\n        \"till\": \"2021-05-08T18:10:00.000Z\",\r\n        \"window\": 15,\r\n        \"exchangeAddresses\": [\r\n            \"0xbcfccbde45ce874adcb698cc183debcf17952812\"\r\n        ],\r\n        \"minTrade\": 10\r\n    }\r\n}`
var requestOptions = {
method: 'POST',
headers: myHeaders,
body: raw,
redirect: 'follow'
};
const chartData = await fetch("https://chartdata.poocoin.app/", requestOptions)
.then(response => response.json())
.then(result => {
  console.log(result.data.ethereum.dexTrades);
const cdata = result.data.ethereum.dexTrades.map((item)=>{
  return{
  "time":new Date(item.timeInterval.minute).getTime() / 1000 + 900 + 330*60,
  "open": resultBNBtoBUSD.data.ethereum.dexTrades[0].close_price * parseFloat(item.open_price),
  "high": resultBNBtoBUSD.data.ethereum.dexTrades[0].close_price * parseFloat(item.maximum_price),
  "low": resultBNBtoBUSD.data.ethereum.dexTrades[0].close_price * parseFloat(item.minimum_price),
  "close": resultBNBtoBUSD.data.ethereum.dexTrades[0].close_price * parseFloat(item.close_price),
  "volume": item.tradeAmount
}
})
return cdata
})



.catch(error => console.log('error', error));


return chartData

})
.catch(error => console.log('error', error));


return data

}

export default FetchChartData
