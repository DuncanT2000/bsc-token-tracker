import React, {useContext, useState} from 'react'
import TabNav from './TabNav';
import Tab from './Tab';
import WalletTracker from './WalletTracker';
import FavouriteTracker from './FavouriteTracker';
import HistoryTracker from './HistoryTracker';
import TrendingTab from './TrendingTab';
import { LSContext } from './Contexts/LSContext';


  
  export default function SideBar(props) {

    const LSCon = useContext(LSContext)

    const [Selected, setSelected] = useState(LSCon.selectedSideBarTab.replaceAll('"', ''))


    return (
      <div id="STDiv" className="panel sidebar">
          <TabNav tabs={['Trending','Wallet','Favourite','History']} 
          selected={Selected} setSelected={setSelected} >
            <Tab isSelected={Selected === 'Trending'}>
                <TrendingTab tokenpathprefix={props.pathprefix} />
            </Tab>
            <Tab isSelected={Selected === 'Wallet'}>
            <WalletTracker tokenpathprefix={props.pathprefix} />
            </Tab>
            <Tab isSelected={Selected === 'Favourite'}>
            <FavouriteTracker tokenpathprefix={props.pathprefix} />
            </Tab>
            <Tab  isSelected={Selected === 'History'}>
            <HistoryTracker  tokenpathprefix={props.pathprefix}/>
            </Tab>
          </TabNav>
      </div>
    );
  }