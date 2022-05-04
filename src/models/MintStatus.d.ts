/**
 * Transactions that fail prior to getting mined will not record a nonce or txHash
 */
interface MintStatusData {
  txHash?: string;
  ipfsHashes: string[];
  ipfsGatewayUrls: string[];
  tokenIds?: number[];
  nonce?: number;
  startIndex: number;
  _id: string;
}

interface MintStatus {
  paintingID: string;
  pendingTx: MintStatusData[];
  failedTx: MintStatusData[];
  successfulTx: MintStatusData[];
  failedIndex: number;
  totalMints: number;
  _id: string;
  totalTx: number;
  isMintComplete: boolean;
}
