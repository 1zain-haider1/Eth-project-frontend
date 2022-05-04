interface User {
  public username: string;

  public email: string;

  public password: string;

  public blockchain: {
    encryptedPrivateKey: string;
  };

  public address: string;

  public keys: {
    publicKey: {
      type: string;
    };
    encryptedPrivateKey: {
      iv: {
        type: string;
      };
      content: {
        type: string;
      };
    };
  };

  public mints: Mint[] | string[];
  _id: string;
}

export default getModelForClass(UserClass);
