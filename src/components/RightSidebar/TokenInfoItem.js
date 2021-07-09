import React from 'react'

import './RightSideBar.css'

const TokenInfoItem = (props) => {
    return (<div className={"TokenInfoItem"} >
            <h4 className={'itemHeader'}>{props.TokenInfoItemHeader}</h4>
            <h5 className={'itemValue'}>{props.TokenInfoItemValue}</h5>
        </div>)
}

export default TokenInfoItem
