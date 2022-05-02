import { FC, useEffect, useState } from "react";
import axios from "axios";
import ListingCard from "../Card/Card";
import Loader from '../../loader';
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import {
  updateAuctionAuthority,
  initAuctionAuthority,
  updateVaultAuthority,
  whitelistCreators,
  validateAuction,
  startAuction,
} from "../../solanaDoc";
import { toast } from "react-toastify";
import { ENV as ChainId } from "@solana/spl-token-registry";
import { Actions } from "../../redux/actions/action";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
const storeID = process.env.REACT_APP_STORE_ID || ""; //'5a8poKNtKHv2BCrSWyDLaa1R9aVnJcMLoMkVM5JGDzfi';
const storeKey = new PublicKey(storeID);
const PrivateKey = process.env.REACT_APP_ADMIN_WALLET;
const BaseUrl = process.env.REACT_APP_BASE_URL;
export class Creator {
  address: string;
  verified: boolean;
  share: number;

  constructor(args: { address: string; verified: boolean; share: number }) {
    this.address = args.address;
    this.verified = args.verified;
    this.share = args.share;
  }
}
const endpoint = {
  name: "devnet",
  label: "devnet",
  url: clusterApiUrl("devnet"),
  chainId: ChainId.Devnet,
};

const Auctions: FC = () => {
  const dispatch = useDispatch();
  const wallet: any = useWallet();
  const auctionsStore: any = useSelector((state: any) => state.auctions);
  const setAuctionsStore = (data: any) => dispatch(Actions.setAuction(data));
  const [loader, setLoader] = useState<any>(false);
  const [Store, SetStore] = useState<any>({ storeId: storeKey });
  const [creators, setCreators] = useState([
    new Creator({
      address: wallet.publicKey?.toBase58(),
      verified: true,
      share: 100,
    }),
  ]);

  useEffect(() => {
    getAuctions()
  }, []);
  const getAuctions=async()=>{
    axios
    .get(BaseUrl + "/nfts/getDataWithAuction")
    .then((res) => {
      console.log(res.data, "res");
      if (res.status === 200) {
        setAuctionsStore(res.data.data);
      }
    })
    .catch((err) => {
      console.log(err, "eror");
    });
  }

  useEffect(() => {
    if (wallet.connected) {
      wallet.privateKey = PrivateKey;
    }
  }, [wallet]);

  useEffect(() => {
    if (wallet.connected) {
      setCreators([
        new Creator({
          address: wallet.publicKey?.toBase58(),
          verified: true,
          share: 100,
        }),
      ]);
    }
  }, [wallet]);
  const getItemIndex = (item: any) => {
    let updateIndex = auctionsStore.findIndex(
      (auction: any) => auction?._id === item._id
    );
    return updateIndex;
  };
  ////init authority
  const createAuctionAuthorityFun = async (item: any, index: number) => {
    try {
        setLoader(true);
    const testnet = true;
    const vault = item.vaultId.vaultAddress;
    const from = wallet;
    const store = Store.storeId.toBase58(); //await metaplex.programs.metaplex.Store.getPDA(wallet.publicKey);
    const auction = item.auctionId.auctionAddress;
    const auctionID = item.auctionId._id;

    const response = await initAuctionAuthority({
      testnet,
      from,
      vault,
      store,
      auction,
    });

    let updatedAuction = auctionsStore.filter(
      (item: any) => item?.auctionId?.status === "inactive"
    );
    const updateStore = [...auctionsStore];
    updateStore[index].auctionId = { ...updateStore[index].auctionId, ...response };
    console.log(updatedAuction[index], "updated auction  ==>", response);

    toast.success("Auction Authority created -!", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
    const data = { ...response };
    // await axios.put(
    //   "http://localhost:5000/auction/initAuction/" + auctionID,
    //   data
    // );
    const resp = await updateAuction(auctionID, data);
    if(resp.data.success === true) {
      setLoader(false)
    }
    setAuctionsStore(updateStore);
    toast.success("Success -- !", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
} catch (err) {
    console.log('errrrrrrrr========?', err)
    setLoader(false)
    toast.error("Something went wrong!", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  }
  };

  //Update auction
  const updateAuctionAuthorityFun = async (item: any, index: any) => {
    try{
      setLoader(true);
      const connection = new Connection(endpoint.url, "confirmed");
      const testnet = true;
      const from = wallet;
      const auction = item.auctionId.auctionAddress;
      const auctionID = item.auctionId._id;
      const auctionManager = item.auctionId?.auctionManager || item?.auctionManager;
      let latestBlock = (await connection.getLatestBlockhash("finalized"))
        .blockhash;
      const resp = await updateAuctionAuthority({
        testnet,
        from,
        auction,
        auctionManager,
        latestBlock,
      });

    let updateIndex = getItemIndex(item);
    let updateStore = [...auctionsStore];
    updateStore[updateIndex].updatedAuctionAuthority = resp;
    const response = await updateAuction(auctionID, { updatedAuctionAuthority: resp });
    if(response.data.success === true) {
      setLoader(false)
    }
    setAuctionsStore(updateStore);
    console.log("update auction authority", resp);
    toast.success("update Auction  to Authority (auction manager) -!", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
} catch (err) {
  console.log('eeeerrrrrr==========', err);
  setLoader(false);
  toast.error("Something went wrong!", {
    position: toast.POSITION.BOTTOM_RIGHT,
  });
}
  };

  //update vault
  const updateVaultAuthorityFun = async (item: any, index: any) => {
try{
  setLoader(true);
    const connection = new Connection(endpoint.url, "confirmed");
    const testnet = true;
    const from = wallet;
    const vault = item.vaultId.vaultAddress;
    const auctionID = item.auctionId._id;
    const auctionManager = item.auctionId?.auctionManager || item?.auctionManager;
    let latestBlock = (await connection.getLatestBlockhash("finalized"))
      .blockhash;
    const resp = await updateVaultAuthority({
      testnet,
      from,
      vault,
      auctionManager,
      latestBlock,
    });
    let updateIndex = getItemIndex(item);
    let updateStore = [...auctionsStore];
    updateStore[updateIndex].updatedVaultAuthority = resp;
    const response = await updateAuction(auctionID, { updatedVaultAuthority: resp });
      if(response.data.success === true) {
        setLoader(false)
      }
    setAuctionsStore(updateStore);
    console.log("update vault authority", resp);
    toast.success("update Vault  to Authority (auction manager) -!", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
} catch (err) {
  console.log('eeeerrrrrr==========', err);
  setLoader(false);
  toast.error("Something went wrong!", {
    position: toast.POSITION.BOTTOM_RIGHT,
  });
}
  };

  //whiteLIst
  const whitelistCreatorsFun = async (item: any, index: any) => {
try{
  setLoader(true);
    const connection = new Connection(endpoint.url, "confirmed");
    const testnet = true;
    const from = wallet;
    const store = Store.storeId.toBase58(); //await metaplex.programs.metaplex.Store.getPDA(wallet.publicKey);
    const auctionID = item.auctionId._id;
    let latestBlock = (await connection.getLatestBlockhash("finalized"))
      .blockhash;
    const uri = item.ipfsMetaData.metaDataUrl;
    const response = await whitelistCreators({
      testnet,
      from,
      uri,
      store,
      latestBlock,
    });
    let updateIndex = getItemIndex(item);
    let updateStore = [...auctionsStore];
    updateStore[updateIndex].whiteListCreatorTx = response;
    const resp = await updateAuction(auctionID, { whiteListCreatorTx: response });
    if(resp.data.success === true) {
      setLoader(false)
    }
    setAuctionsStore(updateStore);
    console.log("create whitelist creator", response);
    toast.success("whiteList creator added -!", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
} catch (err) {
  console.log('eeeerrrrrr==========', err);
  setLoader(false);
  toast.error("Something went wrong!", {
    position: toast.POSITION.BOTTOM_RIGHT,
  });
}
  };

  //validate
  const validateAuctionFun = async (item: any, index: any) => {
try{
  setLoader(true);
    const connection = new Connection(endpoint.url, "confirmed");
    const testnet = true;
    const from = wallet;
    const vault = item.vaultId.vaultAddress;
    const nft = item.mintMetadata.mint; //mintAddress
    // const storePubkey = await metaplex.programs.metaplex.Store.getPDA(wallet.publicKey);
    const store = Store.storeId.toBase58();
    const tokenStore = item.vaultId.vaultData.tokenStore;
    const tokenTracker = item.auctionId?.tokenTracker || item?.tokenTracker;
    // const metadata = item.vaultData.vaultData.metadata;
    // const mintResp = ["metaDataMints"].find(pin => pin.mint.toBase58() === nft);
    const metadata = item.mintMetadata.validMetaData; //"mintResp.metadata"; //public key sy le k ana h:validateMetadata
    const auctionID = item.auctionId._id;
    let latestBlock = (await connection.getLatestBlockhash("finalized"))
      .blockhash;
    const response = await validateAuction({
      testnet,
      from,
      latestBlock,
      vault,
      nft,
      store,
      metadata,
      tokenStore,
      tokenTracker,
    });
    let updateIndex = getItemIndex(item);
    let updateStore = [...auctionsStore];

    updateStore[updateIndex].validateAuctionTx = response;
    const resp = await updateAuction(auctionID, {
      validateAuctionTx: response,
      status: "validated",
    });
    if(resp.data.success === true) {
      setLoader(false)
    }
    setAuctionsStore(updateStore);
    getAuctions()
    console.log("response ==>", response);
    toast.success("Auction validated -!", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
} catch (err) {
  console.log('eeeerrrrrr==========', err);
  setLoader(false);
  toast.error("Something went wrong!", {
    position: toast.POSITION.BOTTOM_RIGHT,
  });
}
  };

  //start auction
  const startAuctionFunc = async (item: any, index: any) => {
    const testnet = true;
    const from = wallet;
    const auction = item.auction?.toBase58() || item.auctionId.auctionAddress;
    const store = Store.storeId.toBase58();
    const auctionManager = item.auctionId.auctionManager;
    const auctionID = item.auctionId._id;
    const resp = await startAuction({
      testnet,
      from,
      store,
      auction,
      auctionManager,
    });
    console.log("auction started", resp);
    let updateIndex = getItemIndex(item);
    const updateStore = [...auctionsStore];
    updateStore[updateIndex].startedAuctionTx = resp;
    await updateAuction(auctionID, {
      startedAuctionTx: resp,
      status: "started",
    });
    getAuctions()
    setAuctionsStore(updateStore);
    toast.success("Auction Started -!", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  const updateAuction = async (auctionID: string, data: any) => {
    const result = await axios.put(BaseUrl + "/auction/" + auctionID, data);
    return result;
  };

  return (
    <>
    {(loader === true) &&
        <Loader />              
      }
      <h1 className="text-center">Auctions</h1>
      <div className="row listing-container mt-4">
        <h2>In-Active</h2>
        {auctionsStore &&
          auctionsStore.length > 0 &&
          auctionsStore
            .map((item: any, index: any) => {
              if(item.auctionId?.status === "inactive"){
              return (
                <div key={index} className="col-lg-4 col-md-6">
                  <ListingCard
                    image={item.mintUri}
                    name={item.auctionId?.auctionName}
                    address={item.auctionAddress}
                    status={item?.auctionId?.status}
                    item={item}
                    index={index}
                    handler={""}
                    btn2="init authority "
                    btn3="update authority"
                    btn4="Update Vault Authority"
                    btn5="Create Whitelist"
                    btn6="Validate"
                    btn2Handler={createAuctionAuthorityFun}
                    btn3Handler={updateAuctionAuthorityFun}
                    btn4Handler={updateVaultAuthorityFun}
                    btn5Handler={whitelistCreatorsFun}
                    btn6Handler={validateAuctionFun}
                  />
                </div>
              );}
              return <></>;
            })}
      </div>
      <div className="row listing-container mt-4">
        <h2>Coming Soon</h2>
        {auctionsStore &&
          auctionsStore.length > 0 &&
          auctionsStore.map((item: any, index: any) => {
              if(item.auctionId?.status === "validated") {
              return (
                <>
                  <div key={index} className="col-lg-4 col-md-6">
                    <ListingCard
                      image={item.mintUri}
                      name={item.auctionId.auctionName}
                      address={item.auctionAddress}
                      status={item?.auctionId?.status}
                      item={item}
                      btn={"Start Auction"}
                      handler={(item: any) => startAuctionFunc(item, index)}
                      auction
                    />
                  </div>
                </>
              );
            }
            return <></>;
            })}
      </div>

      <div className="row listing-container mt-4">
        <h2>Started</h2>
        {auctionsStore &&
          auctionsStore.length > 0 &&
          auctionsStore.map((item: any, index: any) => {
              if(item.auctionId?.status === "started") {
              return (
                  <div key={index} className="col-lg-4 col-md-6 mt-3">
                    <ListingCard
                      index={index}
                      image={item.mintUri}
                      name={item.auctionId.auctionName}
                      address={item.auctionAddress}
                      status={item?.auctionId?.status}
                      item={item}
                      auction
                    />
                  </div>
              );
            }
            return <></>
            })}
      </div>
    </>
  );
};
export default Auctions;
