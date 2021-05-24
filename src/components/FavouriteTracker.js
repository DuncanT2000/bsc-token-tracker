import React, {useContext, useEffect, useState} from 'react'
import {Web3Context} from './Contexts/Web3Context'
import {LSContext} from './Contexts/LSContext'

import { Link } from 'react-router-dom'
import { MdDelete, MdFavoriteBorder, MdFavorite } from "react-icons/md";


const FavouriteTracker = () => {

    const web3con = useContext(Web3Context)
    const LSCon = useContext(LSContext)
    const [isLoading, setisLoading] = useState(true);

    const web3 = web3con.web3

    useEffect(() => {
        
    }, [LSCon.favourite])

    const favouriteToken = (e) => {
        if( e.target.parentNode.parentNode.id == ""){
            return
        }
        LSCon.setfavourite([... LSCon.favourite,e.target.parentNode.parentNode.id])
    }

    const unfavouriteToken = (e) => {
        console.log(e.target.parentNode.parentNode.id);
        const removedToken = LSCon.favourite.filter((token)=>{
            return token.toUpperCase() != e.target.parentNode.parentNode.id.toUpperCase() || token == ""
        }) 
        LSCon.setfavourite([...removedToken])
    }

    const restoreWallet = () => {
        LSCon.setdeleted([])
    }


    return (
        <div style={{background:'#163F56'}}>
            {LSCon.favourite.map(favourite =>{
                return(<div style={{color:'white'}}> 
                    <p>{favourite.name}</p>
                </div>)
            })}
        </div>

    )
    
    


    
}

export default FavouriteTracker
