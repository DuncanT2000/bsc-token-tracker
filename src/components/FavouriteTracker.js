import React, {useContext, useEffect, useState} from 'react'
import {Web3Context} from './Contexts/Web3Context'
import {LSContext} from './Contexts/LSContext'

import { Link } from 'react-router-dom'
import { MdFavorite } from "react-icons/md";


const FavouriteTracker = (props) => {

    const web3con = useContext(Web3Context)
    const LSCon = useContext(LSContext)
    const [isLoading, setisLoading] = useState(true);

    const web3 = web3con.web3

    useEffect(() => {
        
    }, [LSCon.favourite])


    const unfavouriteToken = (e) => {
        

        const removedToken = LSCon.favourite.filter((token)=>{return token.address != e.target.parentNode.parentNode.parentNode.parentNode.id || token == ""}) 

        LSCon.setfavourite([...removedToken])
        
    }


    return (
        <div  style={{background:'#163F56',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
            }}>
                <table>
                <tbody>
                <tr>
    <th>Token Name</th>
    <th>Balance</th>
    <th></th>
   
  </tr>
            {LSCon.favourite.map(favourite =>{
                return(<tr key={favourite.address} id={favourite.address}>
                <td>
                    <Link style={{color:'white'}} 
                    to={`${props.tokenpathprefix}${favourite.address}`}> 
                    <p style={{color:'white'}}>{favourite.name}</p>
                    </Link>
                    </td>
                    <td>
                        0.0000
                    </td>
                    <td>
                    <div id={"UNFAVOR"} onClick={unfavouriteToken}>
                     <MdFavorite id={`fav`} 
                     style={{ 
                         marginLeft:'10px',  
                         color: "red", 
                         fontSize: "1.5em",
                         justifyContent:'flex-end' }} />
                     </div>
                     </td>
                 </tr>)
            })}
            </tbody>
            </table>
        </div>
    )

}

export default FavouriteTracker
