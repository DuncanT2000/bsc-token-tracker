import React, {useContext} from 'react'

import { LSContext } from './Contexts/LSContext';

const TabNav = (props) => {

        const LSCon = useContext(LSContext)

    return (
        <div id="TabDiv" style={{width:'100%' ,minWidth:'25vw',  maxWidth:'40vw'}}>
     
            {
                props.tabs.map((tab) =>{
                    const active = (tab === props.selectedTab ? 'active': '')
                    return( <button key={tab}>
                        <a onClick={() =>{ 
                            LSCon.setselectedSideBarTab(tab)
                            props.setSelected(tab)}} className= { active}>
                            {tab}
                        </a>
                    </button>
                    )
                })
            }
            {props.children}
        </div>
    )
}

export default TabNav
