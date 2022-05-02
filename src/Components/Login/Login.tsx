import { FC, useEffect } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { ClientComponent } from "../../sokcketTest";
import PhantomLogo from "../../assets/images/phantom.png";
import { useWallet } from "@solana/wallet-adapter-react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "./Login.css";
const adminAddress = process.env.REACT_APP_ADMIN_ADDRESS;
const Login: FC = () => {
  const wallet: any = useWallet();
  const history = useHistory();
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
  const login=()=>{
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
          <div className="mt-3">
            <WalletMultiButton />
            <ClientComponent />
          </div>
          <a className="text-white login-btn" onClick={()=>login()}>Login</a>
        </div>
      </div>
    </div>
  );
};
export default Login;
