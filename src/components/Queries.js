import {gql} from '@apollo/client'

export const GET_WALLET_TOKEN = gql`
query GetWalletTokens($network: EthereumNetwork!, $address: String!) {
    ethereum(network: $network) {
      address(address: {is: $address}) {
        address
        balances {
          value
          currency {
            address
            name
            symbol
            tokenType
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
  }
  
`

export const GET_CHART_DATA = gql`
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