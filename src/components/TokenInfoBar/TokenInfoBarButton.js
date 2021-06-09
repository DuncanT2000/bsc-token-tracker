import React from 'react'

const TokenInfoBarButton = (props) => {
    return (
        <button style={styles.button} onClick={()=> window.open(props.url, '_blank').focus()}>{props.text}</button>
    )
}

const styles = {
   button: {
    height:'30%',
    background:'rgba(50, 130, 184, 0.75)',
    color:'white', 
    borderRadius:'12px',  padding:'5% 15%',
    border:'0px solid', 
    margin:'0px 0px 0px 10px',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    }} 

export default TokenInfoBarButton
