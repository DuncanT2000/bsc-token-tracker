import React from 'react'

import { Link } from 'react-router-dom'
import { MdFavorite } from "react-icons/md";

const TrendingTab = (props) => {
    return (
        <div style={{background:'#163F56',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
            }}>
            <table>
                <tbody>
                <tr>
    <th>Token Name</th>
    <th></th>
   
  </tr>
        <tr> 
            <td>
            <Link style={{color:'white'}} 
            to={`${props.tokenpathprefix}0x7083609fce4d1d8dc0c979aab8c869ea2c873402`}> 
                <p style={{color:'white'}}>PolkaDot</p>
            </Link>
            </td>
        </tr>
        <tr> 
            <td>
            <Link style={{color:'white'}} 
            to={`${props.tokenpathprefix}0xb27adaffb9fea1801459a1a81b17218288c097cc`}> 
                <p style={{color:'white'}}>PooCoin</p>
            </Link>
            </td>
        </tr>
            </tbody>
            </table>
        </div>
    )
}

export default TrendingTab
