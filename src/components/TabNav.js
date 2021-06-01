const TabNav = (props) => {


    return (
        <div id="TabDiv" style={{width:'100%' ,minWidth:'25vw',  maxWidth:'40vw'}}>
     
            {
                props.tabs.map((tab) =>{
                    const active = (tab === props.selectedTab ? 'active': '')
                    return( <button key={tab}>
                        <a onClick={() =>{ props.setSelected(tab)}} className= { active}>
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
