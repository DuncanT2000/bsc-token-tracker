
import { Link } from "react-router-dom";
import { MdDelete, MdFavoriteBorder, MdFavorite } from "react-icons/md";

import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  AutoSizer,
  Table,
  Column,
} from "react-virtualized";



const renderHistoryTable = (LSCon, prefix) =>{

      return (
        <div  style={{ height: 'auto', 
        margin:'2%',
        minHeight: '60vh', 
        maxHeight: '100%',
        backgroundColor: "#1B262C" }}>
          <AutoSizer>
            {({ height, width }) => (
              <Table
                width={width}
                height={height}
                headerHeight={45}
                rowHeight={60}
                style={{color:'white'}}
                rowCount={LSCon.history.length}
                rowGetter={({ index }) => LSCon.history[index]}
              >
                {/* Token Name Col */}
                <Column
                  cellRenderer={(col) => {
                    const token = LSCon.history[col.rowIndex];
                    
                    console.log(token.TokenName);

                    return  <Link 
                    to={`${prefix}${token.TokenAddress}`}>
                        <div style={{width:'100%', color:'white'}}>
                        <p style={{marginBottom:'0'}}>{token.TokenName}</p>
                        <p style={{marginTop:'0',fontSize:'70%'}}>{token.TokenSymbol}</p>
                        </div>
                        </Link>

                  }}
                  disableSort={true}
                  width={width}
                  label="Token Name"
                  dataKey={"currency"}
                />
    

              </Table>
            )}
          </AutoSizer>
        </div>
      )

    }



export default renderHistoryTable