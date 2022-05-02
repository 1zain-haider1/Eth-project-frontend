import { FC, useEffect, useState } from "react";
import axios from "axios";
import ListingCard from "../Card/Card";
import { useWallet } from "@solana/wallet-adapter-react";
import { activateVault, createAuction } from "../../solanaDoc";
import { PublicKey } from "@solana/web3.js";
import { toast } from "react-toastify";
import Loader from '../../loader'
import "./Vault.css";

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
const storeID = process.env.REACT_APP_STORE_ID || ""; //'5a8poKNtKHv2BCrSWyDLaa1R9aVnJcMLoMkVM5JGDzfi';
const storeKey = new PublicKey(storeID);
const PrivateKey = process.env.REACT_APP_ADMIN_WALLET;
const BaseUrl = process.env.REACT_APP_BASE_URL;
const Vault: FC = () => {
  const wallet: any = useWallet();
  const [vaults, setvaults] = useState<any>([]);
  const [loader, setLoader] = useState<any>(false);
  const [creators, setCreators] = useState([
    new Creator({
      address: wallet.publicKey?.toBase58(),
      verified: true,
      share: 100,
    }),
  ]);

  useEffect(() => {
    getVaults();
  }, []);
  const getVaults = async () => {
    axios
      .get(BaseUrl+"/nfts/getAllMintsWithVault")
      .then((res) => {
     
        if (res.status) {
          setvaults(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err, "eror");
      });
  };
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

  const activateVaultFunc = async (item: any, index: number) => {
    try {
      setLoader(true)
      const testnet = true;
      const vault = item.vaultId.vaultData.vault;
      const from = wallet;
      await activateVault({ testnet, vault, from });
      const data = { status: "active" };
      const resp = await axios.put(
        BaseUrl+"/vault/activeVault/" + item.vaultId._id,
        data
      );
      if(resp.data.success === true) {
        setLoader(false)
      }
      getVaults();
      // toast.success("Success -- !", {
      //   position: toast.POSITION.BOTTOM_RIGHT,
      // });

      toast.success("vault activated -!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (err) {
      console.log('errr========>', err)
      setLoader(false)
      toast.error("Something went wrong!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  const createAuctionFun = async (
    item: any,
    id: any,
    auctionConfig: any
  ) => {
try {
  setLoader(true)
    console.log(auctionConfig,"auctionConfig")
    const testnet = true;
    const vault = item.vaultId.vaultData.vault;
    const from = wallet;
    const auctionSettings = {
      testnet,
      from,
      vault,
      tickSize: null,
      endAuctionGap: null,
      endAuctionAt: null, //auction end date
      gapTickSizePercentage: null,
      minumumPrice: null,
    };
    const auctionResp = await createAuction(auctionSettings);
    const input: any = {
      vaultData: item,
      ...auctionResp,
    };
    toast.success("Auction initialized -!", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });

    const data = {
      auctionName: auctionConfig.name,
      vaultId: item.vaultId._id,
      storeId: storeID,
      ceilPrice: auctionConfig.ceilPrice,
      floorPrice: auctionConfig.floorPrice,
      auctionEndDate: auctionConfig.endDate,
      auctionStartDate: auctionConfig.startDate,
      auctionAddress: auctionResp.auction.toBase58(),
      tokenStore: "",
      tokenTracker: "",
      creators: creators.map((item) => item.address),
      auctionSettings: { ...auctionSettings, from: from.publicKey.toBase58() },
      status: "inactive",
    };
    console.log(data,"data auctionCOnfig")
    const auctionApiResp = await axios.post(
      BaseUrl+"/auction/createAuction",
      data
    );

      if(auctionApiResp.data.success === true) {
        setLoader(false)
      }
      input.auctionDBId = auctionApiResp.data.auctionId;
      getVaults();
      toast.success("Success -- !", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (err) {
      console.log('errrr======>', err)
      setLoader(false)
      toast.error("Something went wrong!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  return (
    <div>
      <h1 className="text-center">Vaults</h1>
      {(loader === true) &&
        <Loader />              
      }
      <div className="col-12 mt-5 h-100  listing-container">
        <h2>In-Active</h2>
        <div className="row overflow">
          {vaults &&
            vaults.length > 0 &&
            vaults
              .filter((item: any) => item?.vaultId?.status === "inactive")
              .map((item: any, index: any) => {
                return (
                  <div className="col-4">
                    <ListingCard
                      address={item.vaultId.vaultAddress}
                      status={item.vaultId.status}
                      image={item.mintUri}
                      btn={"Activate Vault"}
                      item={item}
                      handler={activateVaultFunc}
                    />
                  </div>
                );
              })}
        </div>
      </div>

      <div className="col-12 mt-5 ">
        <h2>Active</h2>
        <div className="row overflow listing-container">
          {vaults &&
            vaults.length > 0 ?
            vaults
              .filter((item: any) => item?.vaultId?.status === "active")
              .map((item: any) => {
                return (
                  <div className="col-4">
                    <ListingCard
                      image={item.mintUri}
                      address={item.vaultId.vaultAddress}
                      status={item.vaultId.status}
                      item={item}
                      btn={"Create Auction"}
                      handler={createAuctionFun}
                      createAuction
                    />
                  </div>
                );
              }):<p className="text-center ">No data Fond</p>}
        </div>
      </div>
    </div>
  );
};
export default Vault;
