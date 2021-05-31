import React, {useState} from 'react'
import TabNav from './TabNav';
import Tab from './Tab';
import WalletTracker from './WalletTracker';
import FavouriteTracker from './FavouriteTracker';
import HistoryTracker from './HistoryTracker';

  
  export default function SideBar(props) {

    const [Selected, setSelected] = useState('Trending')




    return (
      <div >
          <TabNav tabs={['Trending','Wallet','Favourite','History']} selected={Selected} setSelected={setSelected} >
            <Tab isSelected={Selected === 'Trending'}>
                <p>This is the Trending</p>
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