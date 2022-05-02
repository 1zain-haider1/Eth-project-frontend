import { FC, useState } from "react";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { deploySolanaNFT } from "../../solanaDoc";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import Loader from '../../loader';
import { toast } from "react-toastify";
import { ENV as ChainId } from "@solana/spl-token-registry";
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
const PrivateKey = process.env.REACT_APP_ADMIN_WALLET;
const BaseUrl = process.env.REACT_APP_BASE_URL;

const MintNFT:FC = () => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loader, setLoader] = useState<any>(false);
  const [file, setFile] = useState(null);
  const [metaDataMints, setMetaDataMints] = useState<any[]>([]);
  const wallet: any = useWallet();
  const endpoint = {
    name: "devnet",
    label: "devnet",
    url: clusterApiUrl("devnet"),
    chainId: ChainId.Devnet,
  };
  const [creators, setCreators] = useState([
    new Creator({
      address: wallet.publicKey?.toBase58(),
      verified: true,
      share: 100,
    }),
  ]);

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    setFile(file);
  };
  const pinFileToIPFS = async (file: any): Promise<any> => {
    let data: any = new FormData();
    data.append("file", file);
    data.append(
      "pinataMetadata",
      JSON.stringify({
        name: "zain",
        creator: creators,
      })
    );

    const fileData: any = await uploadFileToIpfs(data);
    const fileUrl: string = `https://gateway.pinata.cloud/ipfs/${fileData.data.IpfsHash}`;
    const fileOutputData = { fileUrl, hash: fileData.data.IpfsHash };
    const metaData: any = await uploadJsonToIpfs(fileOutputData);
    return metaData;
  };
  const uploadFileToIpfs = async (formData: any) => {
    console.log("formData=====>", formData.get("file"));
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": `multipart/form-data; boundary= ${formData._boundary}`,
        Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT}`,
        // pinata_api_key: `${process.env.REACT_APP_PINATA_API_KEY}`,
        // pinata_secret_api_key: `${process.env.REACT_APP_PINATA_API_SECRET}`,
      },
    });
    console.log("response=========>", response);
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
      if (wallet) {
        wallet.privateKey = PrivateKey;
        console.log(wallet,"wallet")
        console.log(uploadedNftFile.metaDataUrl,"uploadedNftFile.metaDataUrl")
        const mintResponse = await deploySolanaNFT({
          from: wallet,
          maxSupply: 2,
          uri: uploadedNftFile.metaDataUrl,
          testnet: true,
        });

        console.log("mint response", mintResponse);
        const validMetaData = mintResponse.metadata.toBase58();
        const edition = mintResponse.edition.toBase58();
        const mint = mintResponse.mint.toBase58();
        const txId = mintResponse.txId;
        const mintMetadata = {
          validMetaData,
          edition,
          txId,
          mint,
        };
        const data = {
          mintMetadata,
          mint,
          mintUri: uploadedNftFile.fileUrl,
          ipfsMetaData: uploadedNftFile,
          supply: 2,
          creators,
          currentOwner: wallet.publicKey.toBase58(),
          previousOwner: "",
          status: "minted",
          price: 1,
        };
        const resp = await axios.post(BaseUrl + "/nfts/mintNft", data);
          if(resp.data.success === true) {
            setLoader(false);
          }
        const mintMeta: any = { ...mintResponse, mintID: resp.data.mintId };
        setMetaDataMints([mintMeta, ...metaDataMints]);
        toast.success("Success -- !", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        
      } else {
        alert("wallet not connected");
      }
    } catch (er) {
      console.log("errrr===>>>", er);
      setLoader(false)
      toast.error("Something went wrong!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
    };
    return (
      <div className="container">
         {(loader === true) &&
              <Loader />              
            }
        <h1>Mint Your NFT</h1>
        <div className="card">
          <div className="m-5">
            <div className="text-secondary text-bold">Name </div>
            <input
              className="form-control"
              name="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="enter name here..."
            />
            <div className="text-secondary text-bold mt-3">Description </div>
            <textarea
              className="form-control"
              rows={4}
              name="description"
              onChange={(e) => setDesc(e.target.value)}
              placeholder="enter description here..."
            ></textarea>
            <div className="text-secondary text-bold mt-3">Select Image</div>
            <input
              type="file"
              className="btn btn-info text-white btn-sm"
              name="file"
              multiple={false}
              onChange={handleImage}
            />
            <hr />
            <button className="btn btn-primary" onClick={mintNewNFT}>
              Mint NFT
            </button>
          </div>
        </div>
      </div>
    );
  };


export default MintNFT;
