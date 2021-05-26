import React,{useEffect, useContext} from 'react'
import SideTab from '../components/SideTab.js';


//0xe9e7cea3dedca5984780bafc599bd69add087d56 - BUSD

const Home = () => {



    return (
        <div style={{backgroundColor:'#163F56'}}>
          <h1 style={{color:'white'}}>Home</h1>
        <SideTab  pathprefix="./token/"/>
        </div>
    )
}

export default Home
