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