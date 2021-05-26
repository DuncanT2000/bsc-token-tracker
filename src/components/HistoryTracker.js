import React, {useContext, useEffect, useState} from 'react'
import {Web3Context} from './Contexts/Web3Context'
import {LSContext} from './Contexts/LSContext'

import { Link } from 'react-router-dom'


const HistoryTracker = (props) => {

    const web3con = useContext(Web3Context)
    const LSCon = useContext(LSContext)

    const web3 = web3con.web3

    useEffect(() => {
        
    }, [LSCon.history])


    return (
        <div style={{background:'#163F56'}}>
            {LSCon.history.map(history =>{
                console.log(history);
                return(<div style={{color:'white'}}> 
                    <p>{history.TokenName}</p>
                </div>)
            })}
        </div>

    )
    
}

export default HistoryTracker
