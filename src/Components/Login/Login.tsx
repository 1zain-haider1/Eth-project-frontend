import axios, { AxiosError } from "axios";
import { ethers } from "ethers";
import React, {
  FC,
  createContext,
  useEffect,
  useState,
  ReactNode,
  ReactElement,
} from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { ClientComponent } from "../../sokcketTest";
import PhantomLogo from "../../assets/images/phantom.png";
import { useWallet } from "@solana/wallet-adapter-react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import {connectWalletProvider, getMetamaskAcctAddress} from '../../service/walletProvider'
import "./Login.css";
const adminAddress = process.env.REACT_APP_ADMIN_ADDRESS;
const Login: FC = () => {
  const wallet: any = useWallet();
  const history = useHistory();


  /**
   * State variables
   */
   const [accessToken, setAccessToken] = useState("");
   const [ethersProvider, setEthersProvider] = useState<
     ethers.providers.Web3Provider | undefined
   >();
   const [signer, setSigner] = useState<
     ethers.providers.JsonRpcSigner | undefined
   >();
   const [adminAddress, setAdminAddress] = useState<string>("");
 
  // useEffect(() => {
  //   if (wallet.connected && wallet?.publicKey?.toBase58()) {
  //     if (wallet.publicKey?.toBase58() === adminAddress) {
  //       toast.success("Logged In Successfully!");
  //       history.push("/mints");
  //     } else {
  //       toast.error("You are not admin");
  //     }
  //   }
  // }, [wallet]);
  const updateWallet = async () => {
    if (ethersProvider) return;
    try {
      const { Web3Provider } = await connectWalletProvider();
      setEthersProvider(Web3Provider);
      setSigner(Web3Provider.getSigner());
      history.push("/mints");
    } catch (err: unknown) {
      const { message } = err as AxiosError;
      alert(message ?? "server error");
    }
  };

  // useEffect(() => {
  //   updateWallet();
  // });
  const login= async()=>{
    if (wallet.connected && wallet?.publicKey?.toBase58()) {
      if (wallet.publicKey?.toBase58() === adminAddress) {
        toast.success("Logged In Successfully!");
        history.push("/mints");
      } else {
        toast.error("You are not admin");
      }
    }
  }

  return (
    <div className="container login">
      <div className="login-content">
        <h2 className="text-bold">Connect Wallet to Login</h2>
        <div className="phantom-card mt-2 p-5">
          <img src={PhantomLogo} className="phantom-logo " />
          <h3 className="text-white mt-2">Phantom</h3>
          <p className="text-white">
            A cryptoWallet Reimagined for Defi {"&"} NFT's
          </p>
          {/* <div className="mt-3">
            <WalletMultiButton />
            <ClientComponent />
          </div> */}
          <a className="text-white login-btn" onClick={()=>updateWallet()}>Login</a>
        </div>
      </div>
    </div>
  );
};
export default Login;
