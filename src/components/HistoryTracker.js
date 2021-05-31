import React, {useContext} from 'react'
import {Web3Context} from './Contexts/Web3Context'
import {LSContext} from './Contexts/LSContext'
import { Link } from 'react-router-dom'



const HistoryTracker = (props) => {

    const web3con = useContext(Web3Context)
    const LSCon = useContext(LSContext)

    const web3 = web3con.web3


    return (
        <div style={{background:'#163F56', marginTop:'25px'}}>
            {LSCon.history.map(history =>{
                return(<div style={{color:'white'}}> 
                    <Link style={{color:'white'}} to={`${props.tokenpathprefix}${history.TokenAddress}`}>
                        <span style={{color:'white'}}>{history.TokenName}</span>
                        </Link>
                </div>)
            })}
        </div>

    )
    
}

export default HistoryTracker
