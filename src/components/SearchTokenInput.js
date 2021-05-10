import React from 'react'
import { withRouter } from 'react-router-dom';

const SearchTokenInput = (props) => {
     const submitForm = (e)=> {
        e.preventDefault()
        props.history.push(`/token/${props.tokenAddressInput}`); // <--- The page you want to redirect your user to.
      }
    
        return (
          <div>
            <form onSubmit={submitForm}>
              <input value={props.tokenAddressInput} onChange={(e)=> props.OntokenAddressInput(e.target.value)} type="text"></input>
            </form>
          </div>
        );
      
    }
    

export default withRouter(SearchTokenInput)
