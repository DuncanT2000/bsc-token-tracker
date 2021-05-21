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

