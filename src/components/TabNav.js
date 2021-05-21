const TabNav = (props) => {


    return (
        <div style={{width:'100%'}}>
     
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
