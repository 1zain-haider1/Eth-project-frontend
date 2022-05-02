import { FC, useMemo } from "react";
import { WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SlopeWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import Dashboard from "./Dashboard";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ClientComponent } from "./sokcketTest";
import Auction from "./Components/Auctions/Auctions";
import Vault from "./Components/Vault/Vault";
import Mints from "./Components/Mints/Mints";
import Login from "./Components/Login/Login";
import MintNFT from './Components/MintNFT/MintNFT'
 import WalletTest from "./newCompFile";
// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

const App: FC = () => {
  const network = WalletAdapterNetwork.Testnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      // new SolflareWalletAdapter({ network }),
      // new TorusWalletAdapter(),
      // new LedgerWalletAdapter(),
      // new SolletWalletAdapter({ network }),
      // new SolletExtensionWalletAdapter({ network }),
    ],
    [network]
  );

  return (
    <>

      {/* <WalletMultiButton />
          <WalletTest />       
          <ClientComponent />   */}
      <BrowserRouter>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <Switch>
              <Route exact path="/" component={Login} />
              <Dashboard>
                <WalletMultiButton />
                <Route exact path="/mintNFT" component={MintNFT} />
                <Route exact path="/mints" component={Mints} />
                <Route exact path="/vault" component={Vault} />
                <Route exact path="/auctions" component={Auction} />
              </Dashboard>
            </Switch>
          </WalletModalProvider>
        </WalletProvider>
      </BrowserRouter>
    </>
  );
};
export default App;
