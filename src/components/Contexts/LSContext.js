import React, {createContext, useState, useEffect} from 'react'


export const LSContext = createContext([])

export const LSContextProvider = ({children}) => {

    const [walletAddress, setwalletAddress] = useState(JSON.parse(localStorage.getItem('walletAddress')) == null ? null :JSON.parse(localStorage.getItem('walletAddress')))
    const [walletInfo, setwalletInfo] = useState(JSON.parse(localStorage.getItem('walletInfo')) == null ? null :JSON.parse(localStorage.getItem('walletInfo')))
    const [trackWalletInfo, settrackWalletInfo] = useState(JSON.parse(localStorage.getItem('trackWalletInfo')) == null ? null :JSON.parse(localStorage.getItem('trackWalletInfo')))
    const [trackWalletAddress, settrackWalletAddress] = useState(JSON.parse(localStorage.getItem('trackWalletAddress')) == null ? null :JSON.parse(localStorage.getItem('trackWalletAddress')))
    const [favourite, setfavourite] = useState(JSON.parse(localStorage.getItem('favourite')) == null ? [] :JSON.parse(localStorage.getItem('favourite')))
    const [deleted, setdeleted] = useState(JSON.parse(localStorage.getItem('deleted')) == null ? [] : JSON.parse(localStorage.getItem('deleted')))
    const [history, sethistory] = useState(JSON.parse(localStorage.getItem('history')) == null ? [] : JSON.parse(localStorage.getItem('history')))
    const [selectedSideBarTab, setselectedSideBarTab] = useState(localStorage.getItem('selectedSideBarTab') != null && localStorage.getItem('selectedSideBarTab') != undefined  ? localStorage.getItem('selectedSideBarTab') : "Trending")


    useEffect(() => {
        let currentfavourite = JSON.parse(localStorage.getItem('favourite'))
        console.log("Favourites: ");
        console.log(currentfavourite == null);
        currentfavourite = currentfavourite == null
        ? localStorage.setItem('favourite',JSON.stringify([]))
        : localStorage.setItem('favourite',JSON.stringify(favourite))
    }, [favourite]);

    useEffect(() => {
        let currentDeleted = JSON.parse(localStorage.getItem('deleted'))
        console.log("Deleted: ");
        console.log(currentDeleted);
        currentDeleted = typeof currentDeleted == 'object'
        ? 
        localStorage.setItem('deleted',JSON.stringify(deleted))
        : localStorage.setItem('deleted',JSON.stringify(deleted))
    }, [deleted]);

    useEffect(() => {
        let currenthistory = JSON.parse(localStorage.getItem('history'))
        console.log("History: ");
        console.log(currenthistory);
        currenthistory = typeof currenthistory == 'object'
        ? localStorage.setItem('history',JSON.stringify(history))
        : localStorage.setItem('history',JSON.stringify(history))
        
    }, [history]);
    
    useEffect(() => {
        let currentwalletInfo = JSON.parse(localStorage.getItem('walletInfo'))
        console.log("WalletInfo: ");
        console.log(currentwalletInfo);
        currentwalletInfo = typeof currentwalletInfo == 'object' 
        ? localStorage.setItem('walletInfo',JSON.stringify(walletInfo))
        : localStorage.setItem('walletInfo',JSON.stringify(walletInfo))
        
    }, [walletInfo]);

    useEffect(() => {
        let currentwalletAddress = JSON.parse(localStorage.getItem('walletAddress'))
        console.log("walletAddress: ");
        console.log(currentwalletAddress);
        currentwalletAddress = typeof currentwalletAddress == 'object' 
        ? localStorage.setItem('walletAddress',JSON.stringify(walletAddress))
        : localStorage.setItem('walletAddress',JSON.stringify(walletAddress))
        
    }, [walletAddress]);

    useEffect(() => {
        let currentTrackwalletInfo = JSON.parse(localStorage.getItem('trackWalletInfo'))
        console.log("trackWalletInfo: ");
        console.log(currentTrackwalletInfo);
        currentTrackwalletInfo = typeof currentTrackwalletInfo == 'object'
        ? localStorage.setItem('trackWalletInfo',JSON.stringify(trackWalletInfo))
        : localStorage.setItem('trackWalletInfo',JSON.stringify(trackWalletInfo))
        
    }, [trackWalletInfo]);

    useEffect(() => {
        let currentTrackwalletAddress = JSON.parse(localStorage.getItem('trackWalletAddress'))
        console.log("trackWalletAddress: ");
        console.log(currentTrackwalletAddress);
        currentTrackwalletAddress = typeof currentTrackwalletAddress == 'object' 
        ? localStorage.setItem('trackWalletAddress',JSON.stringify(trackWalletAddress))
        : localStorage.setItem('trackWalletAddress',JSON.stringify(trackWalletAddress))
        
    }, [trackWalletAddress]);

    useEffect(() => {
        let currentselectedSideBar = JSON.parse(localStorage.getItem('selectedSideBarTab'))
        console.log("selectedSideBarTab: ");
        console.log(currentselectedSideBar);
        currentselectedSideBar = typeof currentselectedSideBar == 'object' 
        ? localStorage.setItem('selectedSideBarTab',JSON.stringify(selectedSideBarTab))
        : localStorage.setItem('selectedSideBarTab',JSON.stringify(selectedSideBarTab))
        
    }, [selectedSideBarTab]);


    const dataProvided ={
        walletInfo,
        setwalletInfo,
        trackWalletInfo,
        settrackWalletInfo,
        trackWalletAddress,
        settrackWalletAddress,
        walletAddress,
        setwalletAddress,
        favourite,
        setfavourite,
        deleted,
        setdeleted,
        history,
        sethistory,
        selectedSideBarTab,
        setselectedSideBarTab
    }

    return (
        <LSContext.Provider value={dataProvided}>
            {children}
        </LSContext.Provider>
    )
}

