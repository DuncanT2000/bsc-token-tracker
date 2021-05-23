import React, {createContext, useState, useEffect} from 'react'


export const LSContext = createContext([])

export const LSContextProvider = ({children}) => {

    const  [walletInfo, setwalletInfo] = useState([])
    const [favourite, setfavourite] = useState([])
    const [deleted, setdeleted] = useState([])
    const [history, sethistory] = useState([])

    useEffect(() => {
        let currentDeleted = localStorage.getItem('deleted')
        currentDeleted = currentDeleted == null ? localStorage.setItem('deleted',JSON.stringify([])) : JSON.parse(currentDeleted)
        setdeleted(currentDeleted)
        let currentfavourite = localStorage.getItem('favourite')
        currentfavourite = currentfavourite == null ? localStorage.setItem('favourite',JSON.stringify([])) : JSON.parse(currentfavourite)
        setfavourite(currentfavourite)
        let currenthistory = localStorage.getItem('history')
        currenthistory = currenthistory == null ? localStorage.setItem('history',JSON.stringify([])) : JSON.parse(currenthistory)
        setfavourite(currenthistory)


    }, [])

    useEffect(() => {
        localStorage.setItem('favourite',JSON.stringify(favourite))
    }, [favourite]);

    useEffect(() => {
        localStorage.setItem('deleted',JSON.stringify(deleted))
    }, [deleted]);

    useEffect(() => {
        localStorage.setItem('history',JSON.stringify(history))
    }, [history]);


    const dataProvided ={
        walletInfo,
        setwalletInfo,
        favourite,
        setfavourite,
        deleted,
        setdeleted,
        history,
        sethistory


    }

    return (
        <LSContext.Provider value={dataProvided}>
            {children}
        </LSContext.Provider>
    )
}

