interface Sale {
  active: boolean;
  price: number;
  cryptoPrice: number;
  orderID: string;
  captureID: string;
  txnHash: string;
  sold: boolean;
  processing: boolean;
}

interface Mint {
  createdAt: Date;
  paintingID: string;
  pastBuyers: Array<User>;
  currentBuyer: User;
  name: string;
  tokenId: string;
  artPieceNumber: string;
  num: number;
  sale: Sale;
  _id: string;
}
