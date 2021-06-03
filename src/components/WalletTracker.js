import React, { useContext, useEffect, useState } from "react";
import { Web3Context } from "./Contexts/Web3Context";
import { LSContext } from "./Contexts/LSContext";
import { useQuery } from "@apollo/client";
import { GET_WALLET_TOKEN } from "./Queries";
import { Link } from "react-router-dom";
import { MdDelete, MdFavoriteBorder, MdFavorite } from "react-icons/md";

import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  Table,
  Column,
} from "react-virtualized";

import renderWalletTable from './RenderTableFunction'
import updateWalletBalances from './UpdateWalletBalances'


const WalletTracker = (props) => {
  const web3con = useContext(Web3Context);
  const LSCon = useContext(LSContext);
  const [trackwalletContainerStatus, settrackwalletContainerStatus] = useState(false);
  
  const runQuery =
      (LSCon.walletInfo != null &&
        LSCon.walletInfo[0].address == web3con.account) ||
      (LSCon.trackWalletInfo != null && LSCon.trackWalletAddress != null)
        ? true
        : false;
  const [isloadingWalletData, setisloadingWalletData] = useState(!runQuery);



  const web3 = web3con.web3;
  const multicall = web3con.multicall;

  const walletAddress = LSCon.trackWalletAddress != null
      ? LSCon.trackWalletAddress
      : web3con.account != null
      ? web3con.account
      : "";

  const { error, loading, data, refetch } = useQuery(GET_WALLET_TOKEN, {
    variables: {
      network: "bsc",
      address: walletAddress,
    },
    skip: runQuery,
  });

  useEffect(() => {
    if (typeof data == "object") {
     if (LSCon.trackWalletAddress == null) {
       LSCon.settrackWalletInfo(null);
        LSCon.setwalletInfo([data.ethereum.address[0]]);
        setisloadingWalletData(false)
      } else if (LSCon.trackWalletAddress != null) {
        LSCon.setwalletInfo(null);
        LSCon.settrackWalletInfo([data.ethereum.address[0]]);
        
        setisloadingWalletData(false)
      }
    }
  }, [data]);


  useEffect(() => {
    refetch();
  }, [web3con.account]);


  const restoreWallet = () => {
    LSCon.setdeleted([]);
  };

  const updateTokensInWallet = () => {
    refetch();
  };

  const opentrackWallet = () => {
    settrackwalletContainerStatus((s) => !s);
  };
  const removetrackWallet = () => {
    LSCon.settrackWalletInfo(null);
    LSCon.settrackWalletAddress(null);
    setisloadingWalletData(true)
  };

  const settrackWallet = (e) => {
    if (web3.utils.isAddress(e.target.children[0].value)) {
      LSCon.settrackWalletAddress(e.target.children[0].value);
      settrackwalletContainerStatus((s) => !s);
      LSCon.setwalletInfo(null);
      setisloadingWalletData(true)
    }
  };


  useEffect(() => {

    let TTO
    let PTO
    let getBalance

           if (LSCon.trackWalletAddress !== null) {

      TTO = setTimeout(() => {
        updateWalletBalances(
          LSCon,
          web3con,
          web3,
          multicall,
          'track'
        );
      }, 2000);
     }
     else if(web3con.account !== null){
      PTO = setTimeout(() => {
        updateWalletBalances(
          LSCon,
          web3con,
          web3,
          multicall,
          'personal'
        );
      }, 2000);
     }
    
    getBalance = setInterval(() => {
      if (LSCon.trackWalletAddress !== null) {

        updateWalletBalances(
          LSCon,
          web3,
          multicall,
          LSCon.trackWalletAddress,
          LSCon.trackWalletInfo,
          'track'
        );
        
      }
      else if (web3con.account !== null) {
          updateWalletBalances(
          LSCon,
          web3,
          multicall,
          web3con.account,
          LSCon.walletInfo,
          'personal'
        );
        
        
      }
  }, 9000);



    return () => {
      window.clearInterval(getBalance);
      window.clearTimeout(PTO)
      window.clearTimeout(TTO)
      console.log('No Longer Updating Balances');
    };
  }, [LSCon.trackWalletAddress]);

  /* */
  return (
    <div style={{ width: 'auto', background: "#163F56" }}>
      {web3con.isWalletConnect == false && LSCon.trackWalletAddress == null ? (
        <p style={{ color: "white" }}>Wallet is not connected!</p>
      ) : 
      isloadingWalletData ? <p style={{ color: "white" }}>Loading...</p> : (
        <div style={{ marginTop: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            {LSCon.trackWalletAddress == null ? (
              <button style={{ margin: "0 5px" }} onClick={opentrackWallet}>
                Track Wallet
              </button>
            ) : (
              <button style={{ margin: "0 5px" }} onClick={removetrackWallet}>
                Remove Wallet
              </button>
            )}

            <button style={{ margin: "0 5px" }} onClick={restoreWallet}>
              Restore
            </button>
            <button style={{ margin: "0 5px" }} onClick={updateTokensInWallet}>
              Load new Tokens
            </button>
          </div>
          {trackwalletContainerStatus ? (
            <div style={{ margin: "10px 5px" }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  settrackWallet(e);
                }}
              >
                <input
                  placeholder="Enter Wallet Address"
                  style={{ margin: "0 5px 0 0" }}
                />
                <button type="submit">Track</button>
              </form>
            </div>
          ) : (
            <></>
          )}
          {error ? <p>Error Collecting Wallet Data...</p> : <></>}
          {
          web3con.isWalletConnect ?
          LSCon.walletInfo != null ? 
          (
            renderWalletTable(LSCon, 'personal',props)
          ) : 
          LSCon.trackWalletInfo != null ? (
            renderWalletTable(LSCon, 'track', props)
          ) : 
          (
            <> </>
          )
            :
            (
              <p>Please Connect Wallet</p>
            )
        }
        </div>
      ) }
    </div>
  );
};

export default WalletTracker;
