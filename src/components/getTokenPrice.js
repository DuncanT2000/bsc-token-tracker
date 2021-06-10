export default async function getTokenPrice 
(lpAddress, web3, multicall,LSCon,TokenDetails, bnbPrice){


    const ReservesToken0CallContext = [
        ...lpAddress[2]['TokenPairBalancesCalls']
    
       ]
       
       const ReservesToken0Results = await multicall.call(ReservesToken0CallContext);

       

       if (TokenDetails.tokenAddress.toUpperCase() == "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c".toUpperCase()) {
         return bnbPrice
       } else {
       if(typeof ReservesToken0Results.results.tokenPairBalancebnb1 == 'undefined' && 
            typeof ReservesToken0Results.results.tokenPairBalancebnb2 == 'object'){

            let tokenBalanceBNBPairv2 = web3.utils.hexToNumberString(ReservesToken0Results.results.tokenPairBalancebnb2.callsReturnContext[0].returnValues[0].hex);
            let BNBBalanceBNBPairv2 = web3.utils.hexToNumberString(ReservesToken0Results.results.BNBPairBalancebnb2.callsReturnContext[0].returnValues[0].hex);;

            const v2Price = (BNBBalanceBNBPairv2 / `1${"0".repeat(18)}`) / (tokenBalanceBNBPairv2 / `1${"0".repeat(TokenDetails.TokenDecimals)}`)

            return bnbPrice * v2Price
          } 
        else if(typeof ReservesToken0Results.results.tokenPairBalancebnb1 == 'object' 
        && typeof ReservesToken0Results.results.tokenPairBalancebnb2 == 'undefined'){

          let tokenBalanceBNBPairv1 = web3.utils.hexToNumberString(ReservesToken0Results.results.tokenPairBalancebnb1.callsReturnContext[0].returnValues[0].hex);
        
          let BNBBalanceBNBPairv1 = web3.utils.hexToNumberString(ReservesToken0Results.results.BNBPairBalancebnb1.callsReturnContext[0].returnValues[0].hex);
        
          const v1Price = (BNBBalanceBNBPairv1 / `1${"0".repeat(18)}`) / (tokenBalanceBNBPairv1 / `1${"0".repeat(TokenDetails.TokenDecimals)}`)

          return bnbPrice * v1Price

        }
        else{

          let tokenBalanceBNBPairv1 = web3.utils.hexToNumberString(ReservesToken0Results.results.tokenPairBalancebnb1.callsReturnContext[0].returnValues[0].hex);
          let BNBBalanceBNBPairv1 = web3.utils.hexToNumberString(ReservesToken0Results.results.BNBPairBalancebnb1.callsReturnContext[0].returnValues[0].hex);
        
          let tokenBalanceBNBPairv2 = web3.utils.hexToNumberString(ReservesToken0Results.results.tokenPairBalancebnb2.callsReturnContext[0].returnValues[0].hex);
          let BNBBalanceBNBPairv2 = web3.utils.hexToNumberString(ReservesToken0Results.results.BNBPairBalancebnb2.callsReturnContext[0].returnValues[0].hex);;
          
          
          const v1Price = (BNBBalanceBNBPairv1 / `1${"0".repeat(18)}`) / (tokenBalanceBNBPairv1 / `1${"0".repeat(TokenDetails.TokenDecimals)}`)
          const v2Price = (BNBBalanceBNBPairv2 / `1${"0".repeat(18)}`) / (tokenBalanceBNBPairv2 / `1${"0".repeat(TokenDetails.TokenDecimals)}`)


          return bnbPrice * v2Price
        }
       }






}