import React from 'react'

const TokenInfoBarButton = (props) => {
    return (
        <button className={`tokenInfobtn ${props.displaySideBar ? 'small-font' : 'large-font-btn'}`} 
        onClick={()=> window.open(props.url, '_blank').focus()}>
            {props.text}
            </button>
    )
}


export default TokenInfoBarButton
