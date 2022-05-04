interface MultipleQualityTexture {
  high: TextureSourceFile;
  medium: TextureSourceFile;
  low: TextureSourceFile;
  default: TextureSourceFile;
}

export interface BoxMetadata {
  darkBackground: boolean;
  hasVolume: boolean;
  ipfsHash: string;
  ipfsGatewayUrl: string;
  frontTexture: MultipleQualityTexture;
  backTexture: TextureSourceFile;
  leftTexture: TextureSourceFile;
  rightTexture: TextureSourceFile;
  topTexture: TextureSourceFile;
  bottomTexture: TextureSourceFile;
  isMinted: boolean;
  _id: string;
  error?: string;
  createdAt: string;
}
