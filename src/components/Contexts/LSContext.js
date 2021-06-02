import React, {createContext, useState, useEffect} from 'react'


export const LSContext = createContext([])

export const LSContextProvider = ({children}) => {

    const [walletInfo, setwalletInfo] = useState(null)
    const [trackWalletInfo, settrackWalletInfo] = useState(null)
    const [trackWalletAddress, settrackWalletAddress] = useState(null)
    const [favourite, setfavourite] = useState([])
    const [deleted, setdeleted] = useState([])
    const [history, sethistory] = useState([])
    const [selectedSideBarTab, setselectedSideBarTab] = useState('trending')

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
        currenthistory = currenthistory == null 
        ? localStorage.setItem('history',JSON.stringify([])) 
        : JSON.parse(currenthistory)

        sethistory(currenthistory)

        let currentselectedSideBar = localStorage.getItem('selectedSideBarTab')
        console.log(currentselectedSideBar);
        currentselectedSideBar = currentselectedSideBar == null 
        ? localStorage.setItem('selectedSideBarTab',JSON.stringify('Trending')) 
        : JSON.parse(currentselectedSideBar)

        setselectedSideBarTab(currentselectedSideBar)


        let currentwalletInfo = localStorage.getItem('walletInfo')
        console.log(currentwalletInfo);
        currentwalletInfo = currentwalletInfo == [] || currentwalletInfo == null 
        ? localStorage.setItem('walletInfo',JSON.stringify([])) 
        : JSON.parse(currentwalletInfo)

        setwalletInfo(currentwalletInfo)

        let currentTrackwalletInfo = localStorage.getItem('trackWalletInfo')
        currentTrackwalletInfo = currentTrackwalletInfo == [] || currentTrackwalletInfo == null 
        ? localStorage.setItem('trackWalletInfo',JSON.stringify(null)) 
        : JSON.parse(currentTrackwalletInfo)
        settrackWalletInfo(currentTrackwalletInfo)

        let currentTrackwalletAddress = localStorage.getItem('trackWalletAddress')
        console.log(currentTrackwalletAddress);
        currentTrackwalletAddress = currentTrackwalletAddress == null
        ? localStorage.setItem('trackWalletAddress',JSON.stringify(null)) 
        : JSON.parse(currentTrackwalletAddress)
        settrackWalletAddress(currentTrackwalletAddress)

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
    
    useEffect(() => {
        localStorage.setItem('walletInfo',JSON.stringify(walletInfo))
    }, [walletInfo]);
    useEffect(() => {
        localStorage.setItem('trackWalletInfo',JSON.stringify(trackWalletInfo))
    }, [trackWalletInfo]);

    useEffect(() => {
        localStorage.setItem('trackWalletAddress',JSON.stringify(trackWalletAddress))
    }, [trackWalletAddress]);

    useEffect(() => {
        console.log(selectedSideBarTab);
        localStorage.setItem('selectedSideBarTab',JSON.stringify(selectedSideBarTab))
    }, [selectedSideBarTab]);


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

