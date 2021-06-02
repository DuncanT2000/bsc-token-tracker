
import { Link } from "react-router-dom";
import { MdDelete, MdFavoriteBorder, MdFavorite } from "react-icons/md";

import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  Table,
  Column,
} from "react-virtualized";



const renderWalletTable = (LSCon, type, props) =>{

  
  const favouriteToken = (e) => {
    console.log(e.target.id);
    const tokenDetails = JSON.parse(e.target.id);
    if (tokenDetails["address"] == "-") {
      tokenDetails["address"] = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
    }
    LSCon.setfavourite([...LSCon.favourite, tokenDetails]);
  };

  const unfavouriteToken = (e) => {
    const tokenDetails = JSON.parse(e.target.parentNode.id);
    tokenDetails["address"] =
      tokenDetails["address"] == "-"
        ? "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
        : tokenDetails["address"];
    const removedToken = LSCon.favourite.filter((token) => {
      return (
        token["address"].toUpperCase() != tokenDetails.address.toUpperCase() ||
        token == ""
      );
    });
    LSCon.setfavourite([...removedToken]);
  };

  const deleteToken = (e) => {
    console.log(e.target.parentNode.id);
    if (e.target.parentNode.id == "") {
      return;
    }
    LSCon.setdeleted([...LSCon.deleted, e.target.parentNode.id]);
  };



    if (type === 'personal') {
      console.log('Running Personal');
      if (LSCon.walletInfo[0].balances.length === 0) {
        return (<div>
          <p>No Tokens Found</p>
          </div>)
      }

      const filteredTokens = LSCon.walletInfo[0].balances.filter(
        (token) => {
            const deleted = LSCon.deleted.map((d)=>{
                d = JSON.parse(d)
                return d.address
            })
            
          return !deleted.includes(token.currency.address);
        }
      );

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
                rowCount={filteredTokens.length}
                rowGetter={({ index }) => filteredTokens[index]}
              >
                {/* Token Name Col */}
                <Column
                  cellRenderer={(col) => {
                    const token = filteredTokens[col.rowIndex];
    
                    return <Link
                    style={{ marginLeft: "10px", color: "white" }}
                    to={`${props.tokenpathprefix}${token.currency.address}`}>
                    {token.currency.name}</Link>
                  }}
                  disableSort={true}
                  width={300}
                  label="Token Name"
                />
    
                {/* TX id Col */}
                <Column
                  cellRenderer={(col) => {
                    const token = filteredTokens[col.rowIndex];
                    return (
                      token.value /
                      `1${"0".repeat(
                        typeof token.currency.decimals == "number"
                          ? token.currency.decimals
                          : 18
                      )}`
                    ).toFixed(6);
                  }}
                  disableSort={true}
                  width={300}
                  label="Balance"
                />
    
                {/* Like Button */}
                <Column
                  cellRenderer={(col) => {
                    const token = Object.assign({},filteredTokens[col.rowIndex].currency);
                    
                    if (token.address == '-'){
                      token.address = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
                    }

                    const isFavourite = LSCon.favourite.some(function (
                      el
                    ) {
                      return (
                        el.address.toUpperCase() ==
                        token.address.toUpperCase()
                      );
                    });
                    if (isFavourite) {
                      return (
                        <div
                          id={JSON.stringify(token)}
                          onClick={unfavouriteToken}
                        >
                          <MdFavorite
                            id={JSON.stringify(token)}
                            style={{
                              marginLeft: "10px",
                              color: "red",
                              fontSize: "1.5em",
                            }}
                          />
                        </div>
                      );
                    } else {
                      return (
                        <div
                          id={JSON.stringify(token)}
                          onClick={favouriteToken}
                        >
                          <MdFavoriteBorder
                            id={JSON.stringify(token)}
                            style={{
                              marginLeft: "10px",
                              color: "white",
                              fontSize: "1.5em",
                            }}
                          />
                        </div>
                      );
                    }
                  }}
                  disableSort={true}
                  width={175}
                  label=""
                />
    
                {/* Like Button */}
                <Column
                  cellRenderer={(col) => {
                    const token = filteredTokens[col.rowIndex];
    
                    return (
                      <MdDelete
                        id={JSON.stringify(token.currency)}
                        style={{
                          marginLeft: "10px",
                          color: "white",
                          fontSize: "1.5em",
                        }}
                        onClick={deleteToken}
                      />
                    );
                  }}
                  disableSort={true}
                  width={200}
                  label=""
                />
              </Table>
            )}
          </AutoSizer>
        </div>
      )

    }

    if (type === 'track') {
      console.log('Running Tracking');
      if (LSCon.trackWalletInfo[0].balances.length === 0) {
        return (<div>
          <p>No Tokens Found</p>
          </div>)
      }
          const filteredTokens = LSCon.trackWalletInfo[0].balances.filter(
    (token) => {
        const deleted = LSCon.deleted.map((d)=>{
            d = JSON.parse(d)
            return d.address
        })
        
      return !deleted.includes(token.currency.address);
    }
  );


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
            rowCount={filteredTokens.length}
            rowGetter={({ index }) => filteredTokens[index]}
          >
            {/* Token Name Col */}
            <Column
              cellRenderer={(col) => {
                const token = filteredTokens[col.rowIndex];

                return <Link
                style={{ marginLeft: "10px", color: "white" }}
                to={`${props.tokenpathprefix}${token.currency.address}`}>
                {token.currency.name}</Link>
              }}
              disableSort={true}
              width={300}
              label="Token Name"
            />

            {/* TX id Col */}
            <Column
              cellRenderer={(col) => {
                const token = filteredTokens[col.rowIndex];
                return (
                  token.value /
                  `1${"0".repeat(
                    typeof token.currency.decimals == "number"
                      ? token.currency.decimals
                      : 18
                  )}`
                ).toFixed(6);
              }}
              disableSort={true}
              width={300}
              label="Balance"
            />

            {/* Like Button */}
            <Column
              cellRenderer={(col) => {
                const token = filteredTokens[col.rowIndex];
                const isFavourite = LSCon.favourite.some(function (
                  el
                ) {
                  return (
                    el.address.toUpperCase() ==
                    token.currency.address.toUpperCase()
                  );
                });
                if (isFavourite) {
                  return (
                    <div
                      id={JSON.stringify(token.currency)}
                      onClick={unfavouriteToken}
                    >
                      <MdFavorite
                        id={JSON.stringify(token.currency)}
                        style={{
                          marginLeft: "10px",
                          color: "red",
                          fontSize: "1.5em",
                        }}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div
                      id={JSON.stringify(token.currency)}
                      onClick={favouriteToken}
                    >
                      <MdFavoriteBorder
                        id={JSON.stringify(token.currency)}
                        style={{
                          marginLeft: "10px",
                          color: "white",
                          fontSize: "1.5em",
                        }}
                      />
                    </div>
                  );
                }
              }}
              disableSort={true}
              width={175}
              label=""
            />

            {/* Like Button */}
            <Column
              cellRenderer={(col) => {
                const token = filteredTokens[col.rowIndex];

                return (
                  <MdDelete
                    id={JSON.stringify(token.currency)}
                    style={{
                      marginLeft: "10px",
                      color: "white",
                      fontSize: "1.5em",
                    }}
                    onClick={deleteToken}
                  />
                );
              }}
              disableSort={true}
              width={200}
              label=""
            />
          </Table>
        )}
      </AutoSizer>
    </div>
  )
    }


}

export default renderWalletTable