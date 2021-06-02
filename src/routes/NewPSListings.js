import React, {useEffect, useContext} from 'react'

import {BlockContext} from '../components/Contexts/useBlockContext.js'
import NewPairsTable from '../components/NewPairsTable'

const NewPSListings = (props) => {

  const NPSLBlockContext = useContext(BlockContext)

  useEffect(() => {



  }, [NPSLBlockContext.LatestBlock.number])

    return (
        <div style={{
          backgroundColor:'#163F56',
          display: 'flex',
          flexDirection: 'column',
          alignItems:'center',
          }}>
          <h1 style={{color:'white'}}>New Listings</h1>
        
          <NewPairsTable />

        </div>
    )
}

export default NewPSListings
