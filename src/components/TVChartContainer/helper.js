// Make requests to CryptoCompare API
import { request, gql } from 'graphql-request'
export async function makeApiRequest(resquestVariable) {

    const GET_CHART_DATA = gql`
    query GetCandleData(
    $baseCurrency: String!,
    $since: ISO8601DateTime,
    $till: ISO8601DateTime,
    $quoteCurrency: String!,
    $exchangeAddresses: [String!]
    $minTrade: Float
    $window: Int) {
    ethereum(network: bsc) {
        dexTrades(
            options: {asc: "timeInterval.minute"}
            date: {since: $since, till: $till}
            exchangeAddress: {in: $exchangeAddresses}
            baseCurrency: {is: $baseCurrency}
            quoteCurrency: {is: $quoteCurrency} # WBNB
            tradeAmountUsd: {gt: $minTrade}
        ) {
            timeInterval {
                minute(count: $window, format: "%Y-%m-%dT%H:%M:%SZ")
            }
            baseCurrency {
                symbol
                address
            }
            quoteCurrency {
                symbol
                address
            }

            tradeAmount(in: USD)
            trades: count
            quotePrice
            maximum_price: quotePrice(calculate: maximum)
            minimum_price: quotePrice(calculate: minimum)
            open_price: minimum(of: block, get: quote_price)
            close_price: maximum(of: block, get: quote_price)
        }
    }
}


`


	try {
		const response = request('https://graphql.bitquery.io', GET_CHART_DATA, 
        {
            "baseCurrency": resquestVariable.tokenAddress,
            "quoteCurrency": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
            "since": resquestVariable.since,
            "till": resquestVariable.till,
            "window": resquestVariable.chartInterval,
            "exchangeAddresses": resquestVariable.SelectedExchanges,
            "minTrade": 10
          }
          )
        .then((data) => {
            return data
        })
        
		return response;
	} catch (error) {
		throw new Error(`BitQuery request error: ${error.status}`);
	}
}
