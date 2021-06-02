import React from 'react'
import SideTab from '../components/SideTab.js';

//0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c - BNB
//0xe9e7cea3dedca5984780bafc599bd69add087d56 - BUSD

const Home = () => {



    return (
        <div style={{
          backgroundColor:'#163F56',
          display: 'flex',
          flexDirection: 'column',
          alignItems:'center',
          }}>
          <h1 style={{color:'white'}}>Home</h1>
        <SideTab  pathprefix="./token/"/>
        </div>
    )
}

export default Home
