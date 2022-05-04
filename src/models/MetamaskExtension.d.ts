interface MetamaskExtension {
  isMetaMask?: boolean;
  request: any;
  chainId: string;
  enable: () => Promise<void>;
}
