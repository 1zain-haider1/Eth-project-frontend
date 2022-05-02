import React, { FC, useEffect, useState } from "react";
import ListingCard from "../Card/Card";
import { useDispatch } from "react-redux";
import { Actions } from "../../redux/actions/action";
import { useSelector } from "react-redux";
import { useWallet } from "@solana/wallet-adapter-react";
import Loader from '../../loader';
import axios from 'axios';
import {
  createTokenVault,
  addTokenToVault,
} from '../../solanaDoc'
import { toast } from "react-toastify";

const Mints: FC = () => {
  const wallet: any = useWallet();
  const dispatch = useDispatch();
  const mints: any = useSelector((state: any) => state.mints);
  const getMints = () => dispatch(Actions.getMints());
  const [loader, setLoader] = useState<any>(false);
  const PrivateKey = process.env.REACT_APP_ADMIN_WALLET;
  const BaseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    getMints();
  }, []);

  useEffect(() => {
    if (wallet.connected) {
      wallet.privateKey = PrivateKey;
    }
  }, [wallet]);

  ///////////////
  const createVault = async (item: any, id: any) => {
    try{
      setLoader(true)
    const vaultResp = await createTokenVault({ testnet: true, from: wallet });
    console.log("vaultResp ===> ", vaultResp);
    let mint = item.mintMetadata.mint;
    const addTovaultResp = await addTokenToVault({
      testnet: true,
      vault: vaultResp,
      token: mint,
      from: wallet,
    });
    const input: any = {
      mint,
      vaultData: {
        ...addTovaultResp,
        vault: vaultResp.vault.toBase58(),
        txId: vaultResp.txId,
      },
      vault: { ...vaultResp },
    };
    const data = {
      vaultName: "new vault",
      mints: [mint],
      vaultAddress: vaultResp.vault.toBase58(),
      vaultData: input.vaultData,
      status: "inactive",
    };
    const vaultApiResp = await axios.post(BaseUrl + "/vault/createVault", data);
    input.vaultDBId = vaultApiResp.data.vaultId;
    let payload = {
      vaultId: vaultApiResp.data.vaultId,
      status: "in-vault",
    };
    const mintApiResp = await axios.put(
      `${BaseUrl}/nfts/addVaultToNft/${id}`,
      payload
    );
    if (mintApiResp) {
      getMints();
    }
    
    if(mintApiResp.data.success) {
      setLoader(false)
    }
    toast.success("Success -- !", {
      position: toast.POSITION.BOTTOM_RIGHT,
      // setVaultsList([input,...VaultsList]);
    });

    toast.success("Vault created added mint -- !", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  } catch (err) {
    setLoader(false)
      console.log('errrr=========>', err)
      toast.error("Something went wrong!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
  }
  };

  return (
    <>
      <h1 className="text-center ">Available Mints</h1>
      {(loader === true) &&
        <Loader />              
      }
      <div className="row">
        {mints===null?"loader":(mints &&
          mints.length > 0) ?
          mints
            .filter((item: any) => item.status === "minted")
            .map((item: any) => {
              return (
                <div className="col-4">
                  <ListingCard
            
                    image={item.mintUri}
                    address={item.mintMetadata.mint}
                    status={item.status}
                    handler={createVault}
                    btn="Add To Vault"
                    item={item}
                    id={item._id}
                  />
                </div>
              );
            }):<p className="text-whtie text-center">No data found</p>}
      </div>
    </>
  );
};
export default Mints;
