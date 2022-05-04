import axios, { AxiosError } from "axios";
import { ethers } from "ethers";
import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
  ReactElement,
} from "react";
import {
  connectWalletProvider,
  getMetamaskAcctAddress,
} from "../service/walletProvider";

interface IAuthContext {
  loggedIn: boolean;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
  ethersProvider?: ethers.providers.Web3Provider;
  signer?: ethers.providers.JsonRpcSigner;
  adminAddress: string;
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

/**
 * The provider and signer is inside the AuthContext because we will be using Metamask to sign into the admin dashboard - there will be an approved metamask address which will be verified on the back end cryptographically with a signed message sent from the front end.
 * See here for details on this implementation: https://www.toptal.com/ethereum/one-click-login-flows-a-metamask-tutorial
 *
 */
export const AuthContextProvider = ({
  children,
}: {
  children: ReactNode;
}): ReactElement => {
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

  /**
   * Configures the header for axios calls
   */
  // useEffect(() => {
  //   // eslint-disable-next-line @typescript-eslint/no-empty-function
  //   if (!accessToken) return () => {};

  //   const requestInterceptor = axios.interceptors.request.use(
  //     (config) => {
  //       if (accessToken) {
  //         config.headers.Authorization = `Bearer ${accessToken}`;
  //       }
  //       return config;
  //     },
  //     (error) => {
  //       throw error;
  //     }
  //   );

  //   return () => {
  //     axios.interceptors.request.eject(requestInterceptor);
  //   };
  // }, [accessToken]);

  /**
   * Connects wallet and updates application context
   * @returns void, updates context state
   */
  const updateWallet = async () => {
    if (ethersProvider) return;
    try {
      const { Web3Provider } = await connectWalletProvider();
      setEthersProvider(Web3Provider);
      setSigner(Web3Provider.getSigner());
    } catch (err: unknown) {
      const { message } = err as AxiosError;
      alert(message ?? "server error");
    }
  };

  useEffect(() => {
    updateWallet();
  });

  /**
   * Makes admin's address available site-wide
   * @returns void, updates context state
   */
  const getAdminAddress = async () => {
    if (adminAddress) return;
    try {
      const address = await getMetamaskAcctAddress();
      setAdminAddress(address);
    } catch (err: unknown) {
      const { message } = err as AxiosError;
      alert(message ?? "server error");
    }
  };

  useEffect(() => {
    getAdminAddress();
  });

  return (
    <AuthContext.Provider
      value={{
        loggedIn: !!accessToken,
        setAccessToken,
        ethersProvider,
        signer,
        adminAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
