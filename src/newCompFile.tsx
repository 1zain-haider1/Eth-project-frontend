import { useWallet } from "@solana/wallet-adapter-react";
import { programs } from '@metaplex/js';
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { ENV as ChainId } from "@solana/spl-token-registry";
import { FC, useEffect, useState } from "react";
import Loader from './loader';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';

import axios from "axios";
import BN from 'bn.js';
  import {
    deploySolanaNFT,
    createTokenVault,
    addTokenToVault,
    activateVault,
    createAuction,
    initAuctionAuthority,
    updateAuctionAuthority,
    updateVaultAuthority,
    whitelistCreators,
    validateAuction,
    startAuction,
    placeBid
  } from './solanaDoc'
  import { toast } from "react-toastify";
const nacl = require('tweetnacl');
const metaplex = require('@metaplex/js');
const bs58 = require('bs58');
toast.configure();
const PrivateKey = process.env.REACT_APP_ADMIN_WALLET;//'5GF5vRBUPt32zK5SKk1oUbrRHb6cWCN4shrTgkHn3czQtSy56PykEnGc4oVoZhF9e1hNZpRZMSYfsvjBK8GppA2Y';//2
// const PrivateKey = '54k5JZVZgWe3Rp3nz5W4QCkQCjR2q8NL7yQst5yWJXG2UsKifPmDbE1y6r2jEYuKKTbb8s4HApCtTU9VnBEE8JLv';//3
const storeID = process.env.REACT_APP_STORE_ID || '';//'5a8poKNtKHv2BCrSWyDLaa1R9aVnJcMLoMkVM5JGDzfi';
const storeKey = new PublicKey(storeID);
// const NATIVE_MINT = new PublicKey("FcMhAJG3hc3nEQD6kdjMEguNbQzzkZuhLDG2mFmPPQNH");
// const NATIVE_MINT = new PublicKey("6THmNSrK1t8KkHQiUJtcTGHLsDRzsBq6NUA39XBChEb5");
const NATIVE_MINT = new PublicKey("So11111111111111111111111111111111111111112");
const BaseUrl = process.env.REACT_APP_BASE_URL;
interface Token2Add {
  tokenAccount: PublicKey;
  tokenMint: PublicKey;
  amount: BN;
}
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

const WalletTest: FC = () => {
  
    const wallet: any = useWallet();
  
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [file, setFile] = useState(null);
    const [tokenAccountAddress, setTokenAccountAddress] = useState<string>("");
    const [mintsToVault, setMintsToVault] = useState<Token2Add[]>([]);
    const [availableMints, setAvailableMints] = useState<any[]>([]);
    const [metaDataMints, setMetaDataMints] = useState<any[]>([]);
    const [loader, setLoader] = useState<any>(false);
    const [attributes, setAttributes] = useState<any>({
      name: "",
      description: "",
      symbol: "",
      external_url: "",
      image: "",
      animation_url: undefined,
      attributes: undefined,
      sellerFeeBasisPoints: 1000,
      // creators: creators,
      properties: {
        files: [],
        category: "image",
      },
    });
    
    // Vaults
    const [VaultsList, setVaultsList] = useState<any[]>([]);
    const [inActiveVaultsList, setInActiveVaultsList] = useState<any[]>([]);
    // -------------------------------------------------------
    // Auction
    const [AuctionList, setAuctionList] = useState<any[]>([]);
    const [AuctionListed, setAuctionListed] = useState<any[]>([]);
    // -------------------------------------------------------
    // 
    const [externalPriceAccountV1, setExternalPriceAccount] = useState<any>(); 
    // -------------------------------------------------------
    const [Store, SetStore] = useState<any>({storeId:storeKey}); 
    const [deployToken, setDeployToken] = useState<any>(); 
    const endpoint = {
      name: "devnet",
      label: "devnet",
      url: clusterApiUrl("devnet"),
      chainId: ChainId.Devnet,
    };
    // State
    const [walletAddress, setWalletAddress] = useState(null);
    const [walletConnected, setWallet] = useState<any>();
    const [creators, setCreators] = useState([
      new Creator({
        address: wallet.publicKey?.toBase58(),
        verified: true,
        share: 100,
      }),
    ]);
    // Actions
     useEffect(() => {
      if (wallet.connected) {
        wallet.privateKey = PrivateKey;
        setWalletAddress(wallet.publicKey?.toBase58())
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
    // minting ===============================================
    const pinFileToIPFS = async (file: any): Promise<any> => {
      let data: any = new FormData();
      data.append("file", file);
      data.append("pinataMetadata", JSON.stringify({
        name:"zain",
        creator: creators
      }));
      
      const fileData: any = await uploadFileToIpfs(data);
      const fileUrl: string = `https://gateway.pinata.cloud/ipfs/${fileData.data.IpfsHash}`;
      const fileOutputData = {fileUrl,hash:fileData.data.IpfsHash};
      const metaData: any = await uploadJsonToIpfs(fileOutputData);
      return metaData
    };
    const uploadFileToIpfs = async (formData: any) => {
      console.log('formData=====>', formData.get('file'));
      const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
      //we gather a local file from the API for this example, but you can gather the file from anywhere
      const response = await axios.post(url, formData,  {
        headers: {
          "Content-Type": `multipart/form-data; boundary= ${formData._boundary}`,
          "Authorization": `Bearer ${process.env.REACT_APP_PINATA_JWT}`
          // pinata_api_key: `${process.env.REACT_APP_PINATA_API_KEY}`,
          // pinata_secret_api_key: `${process.env.REACT_APP_PINATA_API_SECRET}`,
        },
      });
      console.log('response=========>', response)
      return response;
    };
    const uploadJsonToIpfs = async (dataInput: any) => {
      const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
      const data = {
        "name": "zain",
        "symbol": "Gamo",
        "sellerFeeBasisPoints": 0,
        "image": dataInput.fileUrl,
        "description": "Description",
        "properties": {
          "creators": creators?.map((creator: any) => {
            return {
              address: creator?.address,
              share: creator?.share,
            };
          }),
        }
      };
      //we gather a local file from the API for this example, but you can gather the file from anywhere
      const response = await axios.post(url, data,  {
        headers: {
          "Authorization": `Bearer ${process.env.REACT_APP_PINATA_JWT}`
          // pinata_api_key: `${process.env.REACT_APP_PINATA_API_KEY}`,
          // pinata_secret_api_key: `${process.env.REACT_APP_PINATA_API_SECRET}`,
        },
      });
      console.log('response=========>', response)
      dataInput.metaDataUrl = 'https://gateway.pinata.cloud/ipfs/'+response.data.IpfsHash
      return dataInput;
    };
    const mintNewNFT = async () => {
      setLoader(true);
      // console.log('file state==============>', file)
      try {
        const uploadedNftFile = await pinFileToIPFS(file);
        console.log("uploadedNftFile =========> ", uploadedNftFile);
        const connection = new Connection(endpoint.url, "confirmed");
        if(wallet) {
          wallet.privateKey = PrivateKey;
          const mintResponse = await deploySolanaNFT({from:wallet,maxSupply:2,uri:uploadedNftFile.metaDataUrl,testnet:true});
          
          console.log('mint response', mintResponse);
          const validMetaData = mintResponse.metadata.toBase58();
          const edition = mintResponse.edition.toBase58();
          const mint = mintResponse.mint.toBase58();
          const txId = mintResponse.txId;
          const mintMetadata ={
            validMetaData,
            edition,
            txId,
            mint
          }
          const data = {
            mintMetadata,
            mint,
            mintUri:uploadedNftFile.fileUrl,
            ipfsMetaData:uploadedNftFile,
            supply:2,
            creators,
            currentOwner: wallet.publicKey.toBase58(),
            previousOwner:'',
            status:'minted',
            price:1,
          }
          const resp = await axios.post(BaseUrl+'/nfts/mintNft', data)
          if(resp.data.success === true) {
            setLoader(false);
          }
          const mintMeta:any = { ...mintResponse, mintID:resp.data.mintId };
          setMetaDataMints([mintMeta, ...metaDataMints]);
          toast.success("Success -- !", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        } 
      } catch (er) {
        console.log("errrr===>>>", er);
        setLoader(false)
        toast.error("Something went wrong!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      }
      // console.log("🚀 ~ file: TestComponentFile.js ~ line 19 ~ mintNFT ~ connection", connection)
    }
    const mintForm = () => {
        return (
          <div>
            {(loader === true) &&
              <Loader />              
            }
            <div className="container">
              <h1>Mint Your NFT</h1>
              <div className='card'>
                <div className='m-5'>
                  <div className='text-secondary text-bold'>Name </div>
                  <input className='form-control' name="name" onChange={e => setName(e.target.value)} placeholder="enter name here..." />
                  <div className='text-secondary text-bold mt-3'>Description </div>
                  <textarea className='form-control' rows={4} name="description" onChange={e => setDesc(e.target.value)} placeholder="enter description here..."></textarea>
                  <div className='text-secondary text-bold mt-3'>Select Image</div>
                  <input
                    type="file"
                    className="btn btn-info text-white btn-sm"
                    name="file"
                    multiple={false}
                    onChange={handleImage}
                  />
                  <hr />
                  <button className='btn btn-primary' onClick={mintNewNFT}>Mint NFT</button>
                  <hr />
                  <button className='btn btn-primary' onClick={getAllNftsFromWallet}>getAllNftsFromWallet  </button>
                  {/* <button className='btn btn-primary' onClick={createStoreFun}>init Store  </button> */}
                  {/* <button className='btn btn-primary' onClick={getListedAuctions}>get Listed Auctions  </button> */}
                  
                  
                  {/* <button className='btn btn-primary' onClick={createVault}>create Vault </button>
                  <button className='btn btn-primary' onClick={initVault}>Init Vault </button>
                  
                  <button className='btn btn-primary' onClick={deploySolanaToken}>deploy solana token  </button>
                  <button className='btn btn-primary' onClick={mintSolanaToken}>mint solana token  </button>
                  <button className='btn btn-primary' onClick={createExternalPriceTransaction}>Create external  </button>
                  <button className='btn btn-primary' onClick={listAuctions}>listAuctions  </button> */}
                  
                </div>
              </div>
            </div>
          
          </div>
      );
    };
    const getAllNftsFromWallet = async () => {
      const ownerPublickey = wallet.publicKey;
      const connection = new Connection(endpoint.url, "confirmed");
      const NFTMetaData = await Metadata.findDataByOwner(connection, ownerPublickey);
      const NFTMintsData = []
      for(let mintItem of NFTMetaData) {
          const metaData:any = await axios.get(mintItem.data.uri);
          const mintData:any = {...mintItem};
          if(metaData.data){
          mintData.metaData = metaData.data;
          }
          NFTMintsData.push(mintData);
      }
      setAvailableMints(NFTMintsData);
      console.log(":rocket: ~ file: TestComponentFile.js ~ line 33 ~ getAllNftsFromWal ~ NFTMetaData", NFTMetaData);
    };
    const handleImage = (e: any) => {
    const file = e.target.files[0];
    setFile(file);
    // let reader: any = new FileReader();
    // if (file) {
    //   reader.onloadend = () => {
    //     setFile(reader?.result);
    //   };
    //   reader.readAsDataURL(file);
    // }
    // if(e.target.files.length > 0) {
    //   setFile(e.target.files[0])
    // }
    };
    const showMints = () => {
        return (
          <div className="container">
            <h1>available Mints</h1>
            <div className="container">
              <div className="col-md-12 row">
                {availableMints.map((item, index) => {
                  return(
                    <div key={index} className='card col-md-3'>
                      <h6>Mint {item.mint}</h6>
                      <img src={item?.metaData?.image} width="100%" height="100px" alt="image"/>
                      {/* <button onClick={() => addTokenToInactiveVault(item)}>add to vault</button> */}
                      <button onClick={() => createVault(item)}>add to vault direct</button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
    };
    // =========================================================
    // vaults ===============================================
    const createVault = async(mintData:any) => {
      const vaultResp = await createTokenVault({testnet:true,from:wallet});
      console.log('vaultResp ===> ',vaultResp);
      const addTovaultResp = await addTokenToVault({
        testnet:true,
        vault:vaultResp,
        token:mintData.mint,
        from: wallet
      });
      const input:any = {
        mintData,
        vaultData : {...addTovaultResp,vault:vaultResp.vault.toBase58(),txId: vaultResp.txId},
        vault:{...vaultResp}
      }
      const data = { vaultName:'new vault', mints:[mintData.mint], vaultAddress:vaultResp.vault.toBase58(), vaultData:input.vaultData, status:'inactive' }
      const vaultApiResp = await axios.post('http://localhost:5000/vault/createVault', data)
      input.vaultDBId = vaultApiResp.data.vaultId;
      toast.success("Success -- !", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      setVaultsList([input,...VaultsList]);
      toast.success("Vault created added mint -- !", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    };
    const activateVaultFunc = async(item:any, index:number) => {
      const testnet = true;
      const vault = item.vault.vault.toBase58();
      const from = wallet;
      const reesponse = await activateVault({ testnet, vault, from });
      const data = { status:'active' }
      await axios.put('http://localhost:5000/vault/'+item.vaultDBId, data)
      toast.success("Success -- !", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      console.log('vault activated: ', reesponse);
      toast.success("vault activated -!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    };
    const createStoreFun = async() => {
      const testnet = true;
      const from = wallet;
      // const resp = await createStore({ testnet, from });
      // const store = { ...resp };
      // SetStore(store);
    };
    const showActiveVaults = () => {
      return (
        <div className="container">
          <h1>Active Vaults</h1>
          <div className="container">
            <div className="col-md-12 row">
              {VaultsList.map((item, index) => {
                return(
                  <div key={index} className='card col-md-3'>
                    <h6>Vault: {item.vault.txId}</h6>
                    <button onClick={() => activateVaultFunc(item, index)}>activate Vault</button>
                    {/* <button onClick={() => createStoreFun(item, index)}>Create Store</button> */}
                    <button onClick={() => createAuctionFun(item)}>Start Auction</button>
                    {/* <button onClick={() => createAuction(item.vault,item)}>Start Auction</button> */}
                    
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )
    };
    // =========================================================
    // Auction ===============================================
    const createAuctionFun = async(item:any) => {
      const testnet = true;
      const vault = item.vault.vault.toBase58();
      const from = wallet;
      const auctionSettings = { testnet, from, vault, tickSize:null, endAuctionGap:null, endAuctionAt:null, gapTickSizePercentage:null, minumumPrice:null };
      const auctionResp = await createAuction(auctionSettings);
      const input:any = {
        vaultData:item,
        ...auctionResp
      }
      toast.success("Auction initialized -!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      
      console.log('Auction Data', input);
      const data = { 
        auctionName:'new Auction', 
        vaultId: vault, 
        storeId: storeID, 
        ceilPrice: 1, 
        floorPrice: 1, 
        auctionAddress: auctionResp.auction.toBase58(), 
        tokenStore: '',
        tokenTracker: '',
        creators:creators.map(item=>item.address),
        auctionSettings:{...auctionSettings, from:from.publicKey.toBase58()},
        status:'inactive'
      }
      const auctionApiResp = await axios.post('http://localhost:5000/auction/createAuction', data);
      input.auctionDBId = auctionApiResp.data.auctionId;
      setAuctionList([input,...AuctionList]);
      toast.success("Success -- !", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });

    };
    const createAuctionAuthorityFun = async(item:any, index:number) => {
      const testnet = true;
      const vault = item.vaultData.vault.vault.toBase58();
      const from = wallet;
      const store = Store.storeId.toBase58();//await metaplex.programs.metaplex.Store.getPDA(wallet.publicKey);
      const auction = item.auction.toBase58()
      const auctionID = item.auctionDBId
      
      const response = await initAuctionAuthority({ testnet, from, vault, store, auction });
      console.log("initAuctionAuthority  resp==>",response);
      AuctionList[index].Authority = {...response};
      setAuctionList([...AuctionList]);
      toast.success("Auction Authority created -!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      const data = {...response}
      await axios.put('http://localhost:5000/auction/initAuction/'+auctionID, data)
      toast.success("Success -- !", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    };
    const getListedAuctions = async() => {
      const connection = new Connection(endpoint.url, "confirmed");
      const auctionResponse = await metaplex.programs.auction.Auction.findMany(connection, { authority: wallet.publicKey })
      setAuctionListed(auctionResponse)
    };
    const finishAuctionFun = async(item:any) => {
      const testnet = true;
      const from = wallet;
      const vault = item.vaultData.vault.vault.toBase58();
      const auctionManager = await programs.metaplex.AuctionManager.getPDA(
        new PublicKey(item.pubkey.toBase58())
      );
      // const auctionManager = await programs.metaplex.AuctionManager.getPDA(
      //   new PublicKey(item.pubkey.toBase58())
      // );
      // finishAuction({ testnet, from, auction, store, auctionManager, vault, auctionManagerAuthority })
    };
    const listAuctions = () => {
        return (
          <div className="container">
            <h1>List Auctions</h1>
            <div className="container">
              <div className="col-md-12 row">
                {AuctionListed.map((item:any, index:number) => {
                  return(
                    <div key={index} className='card col-md-3'>
                      {/* <h6>Vault: {item.vaultID}</h6> */}
                      <h6>Auction: {item.pubkey.toBase58()}</h6>
                      {/* <h6>TxID: {item.txId}</h6> */}
                      <button onClick={() => finishAuctionFun(item)}>Finish Auction</button>
                      {/* <button onClick={() => createStore()}>Create Store</button>
                      <button onClick={() => initAuctionManager(item.vaultID,item.auctionKey, item.itemVault.safetyDepositTokenStores[0].tokenStoreAccount, index,item)}>init AuctionManager</button>
                      <button onClick={() => startAuction(item)}>Start Auction</button>
                      <button onClick={() => placeBid(new PublicKey(item.auctionKey))}>Place a bid</button>
                      <button onClick={() => validateAuction(item)}>Validate</button>
                      <button onClick={() => updateAuctionAuthority(item)}>update Auction Authority</button>
                      <button onClick={() => updateVaultAuthority(item)}>update Vault Authority</button>
                      <button onClick={() => whitelistCreators()}>create white list</button> */}
                      
                      
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
    };
    const updateAuctionAuthorityFun = async (item:any) => {
      const connection = new Connection(endpoint.url, "confirmed");
      const testnet = true;
      const from = wallet;
      const auction = item.auction.toBase58();
      const auctionManager = item.Authority.auctionManager;
      let latestBlock = (await connection.getLatestBlockhash("finalized")).blockhash;
      const resp = await updateAuctionAuthority({ testnet, from, auction, auctionManager, latestBlock })
      console.log('update auction authority', resp);
      toast.success("update Auction  to Authority (auction manager) -!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    };
    const updateVaultAuthorityFun = async (item:any) => {
      const connection = new Connection(endpoint.url, "confirmed");
      const testnet = true;
      const from = wallet;
      const vault = item.vaultData.vault.vault.toBase58();
      const auctionManager = item.Authority.auctionManager;
      let latestBlock = (await connection.getLatestBlockhash("finalized")).blockhash;
      const resp = await updateVaultAuthority({ testnet, from, vault, auctionManager, latestBlock });
      console.log('update vault authority', resp);
      toast.success("update Vault  to Authority (auction manager) -!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    };
    const whitelistCreatorsFun = async(item:any) => {
      const connection = new Connection(endpoint.url, "confirmed");
      const testnet = true;
      const from = wallet;
      const store = Store.storeId.toBase58(); //await metaplex.programs.metaplex.Store.getPDA(wallet.publicKey);
      let latestBlock = (await connection.getLatestBlockhash("finalized")).blockhash;
      const uri = item.vaultData.mintData.data.uri;
      const response = await whitelistCreators({ testnet, from, uri, store, latestBlock });
      console.log('create whitelist creator', response);
      toast.success("whiteList creator added -!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    };
    
    const validateAuctionFun = async(item:any) => {
      const connection = new Connection(endpoint.url, "confirmed");
      const testnet = true;
      const from = wallet;
      const vault = item.vaultData.vault.vault.toBase58();
      const nft = item.vaultData.mintData.mint; //mintAddress
      // const storePubkey = await metaplex.programs.metaplex.Store.getPDA(wallet.publicKey);
      const store = Store.storeId.toBase58();
      const tokenStore = item.vaultData.vaultData.tokenStore;
      const tokenTracker = item.Authority.tokenTracker;
      // const metadata = item.vaultData.vaultData.metadata;
      const mintResp = metaDataMints.find(pin => pin.mint.toBase58() === nft);
      const metadata = mintResp.metadata; //public key sy le k ana h:validateMetadata
      let latestBlock = (await connection.getLatestBlockhash("finalized")).blockhash;
      const response = await validateAuction({ testnet, from, latestBlock, vault, nft, store, metadata, tokenStore, tokenTracker });
      console.log('response ==>', response);
      toast.success("Auction validated -!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });

    };

    const startAuctionFunc = async(item:any) => {
      const testnet = true;
      const from = wallet;
      const auction = item.auction.toBase58();
      const store = Store.storeId.toBase58();
      const auctionManager = item.Authority.auctionManager;
      const resp = await startAuction({ testnet, from, store, auction, auctionManager });
      console.log('auction started', resp);
      toast.success("Auction Started -!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    };
    const placeBidFunc = async(item:any) => {
      const testnet = true;
      const from = wallet;
      const auction = item.auction.toBase58();
      const amount = new BN(1);
      const resp = await placeBid({ testnet, from, auction, amount });
      console.log("place bid", resp);
    };
    
    const showActiveAuctions = () => {
      return (
        <div className="container">
          <h1>Active Auctions</h1>
          <div className="container">
            <div className="col-md-12 row">
              {AuctionList.map((item, index) => {
                return(
                  <div key={index} className='card col-md-3'>
                    <h6>Vault: {item.vaultID}</h6>
                    <h6>Auction: {item.auctionKey}</h6>
                    <h6>TxID: {item.txId}</h6>
                    <button onClick={() => createAuctionAuthorityFun(item, index)}>init authority (Auction Manager)</button>
                    <button onClick={() => updateAuctionAuthorityFun(item)}>update Auction Authority</button>
                    <button onClick={() => updateVaultAuthorityFun(item)}>update Vault Authority</button>
                    <button onClick={() => whitelistCreatorsFun(item)}>Create whiteList</button>
                    <button onClick={() => validateAuctionFun(item)}>Validate</button>
                    <button onClick={() => startAuctionFunc(item)}>Start Auction</button>
                    <button onClick={() => placeBidFunc(item)}>Place bid</button>
                    {/* <button onClick={() => createStore()}>Create Store</button>
                    
                    <button onClick={() => startAuction(item)}>Start Auction</button>
                    <button onClick={() => placeBid(new PublicKey(item.auctionKey))}>Place a bid</button>
                    <button onClick={() => validateAuction(item)}>Validate</button>
                    <button onClick={() => updateAuctionAuthority(item)}>update Auction Authority</button>
                    <button onClick={() => updateVaultAuthority(item)}>update Vault Authority</button>
                    <button onClick={() => whitelistCreators()}>create white list</button> */}
                    
                    
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )
    };
    return (
        <div className="App">
          <div className="container">
            {/* <div className="header-container">
              <p className="header">🍭</p>
              <p className="sub-text">Minting Portal</p>
              {!walletAddress && renderNotConnectedContainer()}
            </div> */}
            {/* Check for walletAddress and then pass in walletAddress */}
            {showActiveAuctions()}
            {mintForm()}
            {showActiveVaults()}
            {/* {showInActiveVaults()} */}
            {showMints()}
            {listAuctions()}
            {/* {listAuctions()} */}
            {/* <div className="footer-container">
              <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
              <a
                className="footer-text"
                href={TWITTER_LINK}
                target="_blank"
                rel="noreferrer"
              >{`built on @${TWITTER_HANDLE}`}</a>
            </div> */}
          </div>
           {/* <ConnectionProvider endpoint={endpoint}>
      <Dashboard>
  
      </Dashboard>
      
    </ConnectionProvider> */}
        </div>
      );

};
export default WalletTest;