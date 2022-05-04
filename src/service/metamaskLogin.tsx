import { Flex, Heading, Image, Spinner } from "@chakra-ui/react";
import React, { ReactElement, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import metamaskLogo from "../assets/images/login_with_metamask.png";
import { AuthContext } from "../context/AuthContext";
import axios, { AxiosError } from "axios";

const MetamaskLogin = (): ReactElement => {
  const { setAccessToken, adminAddress, signer } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();

  const loginWithMetamask = async (): Promise<void> => {
    setLoading(true);
    const getNonceData = {
      metamaskAddress: adminAddress,
    };

    let signature: string | undefined;
    try {
    //   const { nonce } = (
    //     await axios.post("/admin/login/metamask/get-nonce", getNonceData)
    //   ).data;
    // ${nonce}
      signature = await signer?.signMessage(
        `By clicking "sign" I confirm I am an approved administrator of by Eth project. (message nonce: )`
      );
      const metamaskLoginData = { ...getNonceData, signature };
        console.log(metamaskLoginData)
    //   const { token } = (
    //     await axios.post("/admin/login/metamask", metamaskLoginData)
    //   ).data;

    //   setAccessToken(token);
      setLoading(false);
      history.push("/mintNFT");
    } catch (err: unknown) {
      const { message } = err as AxiosError;
      alert(message ?? "server error");
      setLoading(false);
    }
  };

  return (
    <Flex alignItems="center" flexDirection="column" justifyContent="center">
      {loading ? (
        <Flex
          width="100%"
          height="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner />
        </Flex>
      ) : (
        <>
          <Heading size="sm" marginBottom={5} textAlign="center">
            Login with
          </Heading>
          <Image
            cursor="pointer"
            onClick={loginWithMetamask}
            width="300px"
            src={metamaskLogo}
          />
        </>
      )}
    </Flex>
  );
};

export default MetamaskLogin;
