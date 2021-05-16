import React, { useEffect, useState } from 'react'
import './App.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from './routes/Home';
import Token from './routes/Token';
import Navbar from './components/Navbar.js';
import {BlockContextProvider} from './components/Contexts/useBlockContext'
import { Web3ContextProvider } from './components/Contexts/Web3Context';
import { Connectors } from 'web3-react'
import { ApolloProvider, 
  ApolloClient, 
  InMemoryCache, 
  HttpLink,
  from } from '@apollo/client';
import {onError} from '@apollo/client/link/error'

const errorLink = onError(({graphqlErrors, networkError})=>{
  if (graphqlErrors) {
    graphqlErrors.map((error, location,path)=>{
      alert(`Graphql error ${error}`)
    });
  }

})

const link = from([
  errorLink,
  new HttpLink({ uri:"https://graphql.bitquery.io",
  headers:{'X-API-KEY':'BQYojbUdmxerh78eSw3RzeEk1buvH4xl'} }),
])

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link
})

function App() {

  const [tokenAddressInput, settokenAddressInput] = useState('');

  
  return (
    <ApolloProvider client={client}>

    <Web3ContextProvider>
    <BlockContextProvider>
    <Router>
      <Navbar tokenAddressInput={tokenAddressInput} OntokenAddressInput={settokenAddressInput}/>
    <div className="App">
      

     <Switch>
     <Route path="/" exact component={Home}/>
          <Route path="/token/:tokenAddress" exact component={Token}/>
        </Switch>

    </div>
    </Router>
    </BlockContextProvider>
    </Web3ContextProvider>
    </ApolloProvider>
  );
}

export default App;


// subscription swaps{
//   swaps(orderBy: timestamp, orderDirection: desc, 
//     where:{pair: "0xd90a1ba0cbaaaabfdc6c814cdf1611306a26e1f8"}) {
//     id
//     timestamp
//     amount0In
//     amount1In
//     amount0Out
//     amount1Out
// 		amountUSD
//     transaction{
//       blockNumber
//     }
//     pair {
      
//       reserve0
//       reserve1
//       token0 {
//         id
//         symbol
//       }
//       token1 {
//         id
//         symbol
//       }
//     }
//   }
// }


// {
//   "amount0In": "0",
//   "amount0Out": "0.043691216556378136",
//   "amount1In": "35.961",
//   "amount1Out": "0",
//   "amountUSD": "147.5006528766920798517614013842559",
//   "id": "0xc42e02463ccaadd7c88672a8723c05d494140a8e4cbde02d5c93eb46a47d3043-0",
//   "pair": {
//     "reserve0": "2151.791636693692989917",
//     "reserve1": "1763310.654697965921638858",
//     "token0": {
//       "id": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
//       "symbol": "WETH"
//     },
//     "token1": {
//       "id": "0xcc4304a31d09258b0029ea7fe63d032f52e44efe",
//       "symbol": "SWAP"
//     }
//   },
//   "timestamp": "1620217389",
//   "transaction": {
//     "blockNumber": "12374163"
//   }
// }
