import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import MouseOverIcon from '../MouseOverIcon'

const TokenInfoBarItem = (props) => {
    return (
        <div style={styles.tokenInfoContainer}> 
        <p>{props.title}: {props.isNumber ? !props.isLoading ? 
        <MouseOverIcon 
        number={isFinite(props.content) ?props.content : 0 } /> : 
            <CircularProgress color='white' size={20} disableShrink />: <> </>} </p>
        <p>{!props.isLoading ?  
        props.isNumber ? props.isMoney ? "$" + props.content.toLocaleString() : props.content.toLocaleString() : props.content : 
        <CircularProgress color={'white'} size={20} disableShrink />}</p>
      </div> 
    )
}

const styles = {
    tokenInfoContainer:{
      whiteSpace: 'nowrap',
      marginRight:'2%'
    }
  }

export default TokenInfoBarItem
