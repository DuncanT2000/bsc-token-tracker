

const FetchSwapData= async (tokenAddress,PairContract,PairContractv2,web3Instance)=>{

    console.log('Fetching Swaps')

      const currentBlock = await web3Instance.eth.getBlockNumber();
      let pastSwapEventsv1 = await PairContract.getPastEvents('Swap',{fromBlock: currentBlock - 4999})

      let pastSwapEventsv2 = await PairContractv2.getPastEvents('Swap',{fromBlock: currentBlock - 4999})
      
      let token0PC = await PairContract.methods.token0().call()
      let token0PCv2 = await PairContractv2.methods.token0().call()

      console.log(token0PC)
      console.log(token0PCv2)


      
      pastSwapEventsv1 = pastSwapEventsv1.map( swapEvent =>{
        if (token0PC.toLowerCase() == tokenAddress.toLowerCase() ) {
          return{
            "blockNumber": swapEvent.blockNumber,
              "amount0In": swapEvent.returnValues.amount0In,
              "amount0Out": swapEvent.returnValues.amount0Out,
              "amount1In": swapEvent.returnValues.amount1In,
              "amount1Out": swapEvent.returnValues.amount1Out,
              "txHash":swapEvent.transactionHash,
        }
        } else {
          return{
            "blockNumber": swapEvent.blockNumber,
              "amount0In": swapEvent.returnValues.amount1In,
              "amount0Out": swapEvent.returnValues.amount1Out,
              "amount1In": swapEvent.returnValues.amount0In,
              "amount1Out": swapEvent.returnValues.amount0Out,
              "txHash":swapEvent.transactionHash,
        }
        }
        
      })

      pastSwapEventsv2 = pastSwapEventsv2.map(swapEvent =>{
        if (token0PCv2.toLowerCase() == tokenAddress.toLowerCase() ) {
          return{
            "blockNumber": swapEvent.blockNumber,
              "amount0In": swapEvent.returnValues.amount0In,
              "amount0Out": swapEvent.returnValues.amount0Out,
              "amount1In": swapEvent.returnValues.amount1In,
              "amount1Out": swapEvent.returnValues.amount1Out,
              "txHash":swapEvent.transactionHash,
        }
        } else {
          return{
            "blockNumber": swapEvent.blockNumber,
              "amount0In": swapEvent.returnValues.amount1In,
              "amount0Out": swapEvent.returnValues.amount1Out,
              "amount1In": swapEvent.returnValues.amount0In,
              "amount1Out": swapEvent.returnValues.amount0Out,
              "txHash":swapEvent.transactionHash,
        }
        }
         
        
      })

     let pastSwapEvents = [...pastSwapEventsv1, ...pastSwapEventsv2] 
        
     pastSwapEvents = pastSwapEvents.sort(function (a, b) {
          return a.blockNumber - b.blockNumber;
        });

     if (pastSwapEvents.length > 500) {
      pastSwapEvents.slice(0, 500)
     }
  
/*      await Promise.all(
        pastSwapEvents.map(async item => {
          const blockData = await web3Instance.eth.getBlock(item.blockNumber,false);
          item.timestamp = blockData.timestamp
          return item
      })
    ) */
      


  


    return pastSwapEvents

}

export default FetchSwapData
