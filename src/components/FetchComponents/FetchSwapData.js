

const FetchSwapData= async (PairContract,PairContractv2,web3Instance)=>{

    console.log('Fetching Swaps')

      const currentBlock = await web3Instance.eth.getBlockNumber();
      let pastSwapEventsv1 = await PairContract.getPastEvents('Swap',{fromBlock: currentBlock - 4999})

      let pastSwapEventsv2 = await PairContractv2.getPastEvents('Swap',{fromBlock: currentBlock - 4999})
      pastSwapEventsv1 = pastSwapEventsv1.map( swapEvent =>{
        
         return{
            "blockNumber": swapEvent.blockNumber,
              "amount0In": swapEvent.returnValues.amount0In,
              "amount0Out": swapEvent.returnValues.amount0Out,
              "amount1In": swapEvent.returnValues.amount1In,
              "amount1Out": swapEvent.returnValues.amount1Out,
              "txHash":swapEvent.transactionHash,
        }
      })

      pastSwapEventsv2 = pastSwapEventsv2.map(swapEvent =>{

          return {
             "blockNumber": swapEvent.blockNumber,
               "amount0In": swapEvent.returnValues.amount0In,
               "amount0Out": swapEvent.returnValues.amount0Out,
               "amount1In": swapEvent.returnValues.amount1In,
               "amount1Out": swapEvent.returnValues.amount1Out,
               "txHash":swapEvent.transactionHash,
               
         }
         
        
      })

     let pastSwapEvents = [...pastSwapEventsv1, ...pastSwapEventsv2] 

  
/*      await Promise.all(
        pastSwapEvents.map(async item => {
          const blockData = await web3Instance.eth.getBlock(item.blockNumber);
          item.timestamp = blockData.timestamp
          return item
      })
    )
      */


  
     pastSwapEvents = pastSwapEvents.sort(function (a, b) {
      return a.blockNumber - b.blockNumber;
    });


    return pastSwapEvents

}

export default FetchSwapData
