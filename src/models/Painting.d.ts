/**
 * The difference between pending and drafted is whether JSONdata has been pinned to IPFS. We do not pin to IPFS for drafts because the user (in this case, an artefy admin) has still not confirmed the number of NFTs to mint.
 * Pending mints will be attempted as soon as Painting metadata has been successfully stored in Mongodb.
 */
type MintProgress = "Minted" | "Pending" | "Drafted" | "Failed";

interface Painting {
  platform: string;
  artists: string[];
  theme: string;
  dropId: string;
  mints: string[] & Mint[];
  partnerBadge: string;
  name: string;
  year: any;
  genre: string;
  pointVal: number;
  dropDate: string;
  description: string;
  createdAt: string;
  about: string;
  mintStatus: MintProgress;
  mintStatusData: MintStatus;
  skybox?: string & Skybox;
  image: string;
  previewImage: string;
  file: string;
  animation_url: string;
  boxMetadata: BoxMetadata;
  format: string;
  size?: string;
  rarity: string;
  filetype: string;
  fractionalOwnership: boolean;
  allowStaking: boolean;
  num: number;
  _id: string;
  size: Size;
}
