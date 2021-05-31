import React, {createContext, useState, useEffect} from 'react'


export const LSContext = createContext([])

export const LSContextProvider = ({children}) => {

    const [walletInfo, setwalletInfo] = useState([])
    const [trackWalletInfo, settrackWalletInfo] = useState(null)
    const [trackWalletAddress, settrackWalletAddress] = useState(null)
    const [favourite, setfavourite] = useState([])
    const [deleted, setdeleted] = useState([])
    const [history, sethistory] = useState([])

    useEffect(() => {
        let currentDeleted = localStorage.getItem('deleted')
        console.log(currentDeleted);
        currentDeleted = currentDeleted == null ? localStorage.setItem('deleted',JSON.stringify([])) : JSON.parse(currentDeleted)
        setdeleted(currentDeleted)
        let currentfavourite = localStorage.getItem('favourite')
        console.log(currentfavourite);
        currentfavourite = currentfavourite == null ? localStorage.setItem('favourite',JSON.stringify([])) : JSON.parse(currentfavourite)
        setfavourite(currentfavourite)
        let currenthistory = localStorage.getItem('history')
        console.log(currenthistory);
        currenthistory = currenthistory == null ? localStorage.setItem('history',JSON.stringify([])) : JSON.parse(currenthistory)
        sethistory(currenthistory)
        let currentwalletInfo = localStorage.getItem('walletInfo')
        console.log(currentwalletInfo);
        currentwalletInfo = currentwalletInfo == null ? localStorage.setItem('walletInfo',JSON.stringify([])) : JSON.parse(currentwalletInfo)
        setwalletInfo(currentwalletInfo)

        let currentTrackwalletInfo = localStorage.getItem('trackWalletInfo')
        console.log(currentTrackwalletInfo);
        currentTrackwalletInfo = currentTrackwalletInfo == null ? localStorage.setItem('trackWalletInfo',JSON.stringify(null)) : JSON.parse(currentTrackwalletInfo)
        settrackWalletInfo(currentTrackwalletInfo)

        let currentTrackwalletAddress = localStorage.getItem('trackWalletAddress')
        console.log(currentTrackwalletAddress);
        currentTrackwalletAddress = currentTrackwalletAddress == null ? localStorage.setItem('trackWalletAddress',JSON.stringify(null)) : JSON.parse(currentTrackwalletAddress)
        settrackWalletAddress(currentTrackwalletAddress)



    }, [])

    useEffect(() => {
        localStorage.setItem('favourite',JSON.stringify(favourite))
    }, [favourite]);

    useEffect(() => {
        localStorage.setItem('deleted',JSON.stringify(deleted))
    }, [deleted]);

    useEffect(() => {
        console.log(sethistory);
        localStorage.setItem('history',JSON.stringify(history))
    }, [history]);
    
    useEffect(() => {
        localStorage.setItem('walletInfo',JSON.stringify(walletInfo))
    }, [walletInfo]);
    useEffect(() => {
        localStorage.setItem('trackWalletInfo',JSON.stringify(trackWalletInfo))
    }, [trackWalletInfo]);

    useEffect(() => {
        localStorage.setItem('trackWalletAddress',JSON.stringify(trackWalletAddress))
    }, [trackWalletAddress]);


    const dataProvided ={
        walletInfo,
        setwalletInfo,
        trackWalletInfo,
        settrackWalletInfo,
        trackWalletAddress,
        settrackWalletAddress,
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

