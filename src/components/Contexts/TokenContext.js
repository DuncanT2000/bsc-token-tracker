import React, { useEffect, useState,useRef, createContext } from 'react'

export const TokenContext = createContext()


export const TokenContextProvider = ({children}) => {

    const [test, settest] = useState('')

    useEffect(() => {

    }, [])


    return (
        <TokenContext.Provider value={{test,settest}}>
            {children}
        </TokenContext.Provider>
    )
}

