import React from 'react'

const TokenInfoBarButton = (props) => {
    return (
        <button className="tokenInfobtn" 
        onClick={()=> window.open(props.url, '_blank').focus()}>
            {props.text}
            </button>
    )
}


export default TokenInfoBarButton
