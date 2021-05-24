import React,{useEffect, useContext} from 'react'
import {BlockContext} from '../components/Contexts/useBlockContext.js'
import WalletTracker from '../components/WalletTracker.js';
import SideTab from '../components/SideTab.js';
const { ethers } = require("ethers");
const { Contract, Provider } = require('ethers-multicall');
const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed1.defibit.io/');


//0xe9e7cea3dedca5984780bafc599bd69add087d56 - BUSD

const Home = () => {

  const BlockContextCon = useContext(BlockContext)


    useEffect(() => {
        const daiAddress = '0xb27adaffb9fea1801459a1a81b17218288c097cc';
        const BEPABI = [
            // Some details about the token
            "function name() view returns (string)",
            "function symbol() view returns (string)",
          
            // Get the account balance
            "function balanceOf(address) view returns (uint)",
          
            // Send some of your tokens to someone else
            "function transfer(address to, uint amount)",
        
            "function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast)",
            // An event triggered whenever anyone transfers to someone else
            "event Transfer(address indexed from, address indexed to, uint amount)"
          ];
        
          const PAIRABI = [
        
            "function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast)",
          ];
        
        async function call() {
            const ethcallProvider = new Provider(provider);
          
            await ethcallProvider.init(); // Only required when `chainId` is not provided in the `Provider` constructor
          
        
        
            const daiContract = new Contract(daiAddress, BEPABI);
          
            const pancakeDaiPool = '0x746a3f1a3863cf839bf0702c083cCA888AbA6EE8';
        
            const PairContract = new Contract(pancakeDaiPool, BEPABI);
          
            const daiBalanceCall = daiContract.balanceOf(pancakeDaiPool);
            const reserveCall = PairContract.getReserves();
          
            const [reserves] = await ethcallProvider.all([reserveCall]);
          
            console.log('Reserve 0: ' + reserves[0] / 100000000);
            console.log('Reserve 1: ' + reserves[1] / 1000000000000000000);
            console.log('');
            
            console.log((parseFloat(reserves[0].toString()) / parseFloat(reserves[1].toString())));
          }

             call() 
    
          
    }, [])




    return (
        <div>
          <h1>Home</h1>
        <SideTab />
        </div>
    )
}

export default Home
