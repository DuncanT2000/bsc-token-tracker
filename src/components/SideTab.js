import React, {useState} from 'react'
import TabNav from './TabNav';
import Tab from './Tab';


  
  export default function SideBar() {

    const [Selected, setSelected] = useState('Trending')




    return (
      <div >
          <TabNav tabs={['Trending','Wallet','Favourite','History']} selected={Selected} setSelected={setSelected} >
            <Tab isSelected={Selected === 'Trending'}>
                <p>This is the Trending</p>
            </Tab>
            <Tab isSelected={Selected === 'Wallet'}>
            <p>This is the Wallet</p>
            </Tab>
            <Tab isSelected={Selected === 'Favourite'}>
            <p>This is the Favourite</p>
            </Tab>
            <Tab  isSelected={Selected === 'History'}>
            <p>This is the History</p>
            </Tab>
          </TabNav>
      </div>
    );
  }