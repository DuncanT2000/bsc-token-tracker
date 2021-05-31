import React, { useState } from 'react'
import './App.css'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from './routes/Home';
import Token from './routes/Token';
import Navbar from './components/Navbar.js';
import {BlockContextProvider} from './components/Contexts/useBlockContext'
import { Web3ContextProvider } from './components/Contexts/Web3Context';
import { LSContextProvider } from './components/Contexts/LSContext';
import { ApolloProvider, 
  ApolloClient, 
  InMemoryCache, 
  HttpLink,
  from } from '@apollo/client';
import {onError} from '@apollo/client/link/error'

const errorLink = onError(({graphqlErrors})=>{
  if (graphqlErrors) {
    graphqlErrors.map((error)=>{
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
      <LSContextProvider>
        <BlockContextProvider>
    <Web3ContextProvider>
    
    <Router>
      <Navbar tokenAddressInput={tokenAddressInput} OntokenAddressInput={settokenAddressInput}/>
    <div className="App">
      

     <Switch>
     <Route path="/" exact component={Home}/>
          <Route path="/token/:tokenAddress" exact component={Token}/>
        </Switch>

    </div>
    </Router>
    </Web3ContextProvider>
    </BlockContextProvider>
    
    </LSContextProvider>
    </ApolloProvider>
  );
}

export default App;

