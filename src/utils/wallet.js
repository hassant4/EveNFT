import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

export default function getConnector(props){

    // Create a connector
    const connector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org", // Required
      qrcodeModal: QRCodeModal,
    });
    
    // Check if connection is already established
    if (!connector.connected) {
      // create new session
      connector.createSession();
    }
    
    // Subscribe to connection events
    connector.on("connect", (error, payload) => {
      if (error) {
        throw error;
      }
    
      // Get provided accounts and chainId
      const { accounts, chainId } = payload.params[0];
      console.log('connected')
    });
    
    connector.on("session_update", (error, payload) => {
      if (error) {
        throw error;
      }
    
      // Get updated accounts and chainId
      const { accounts, chainId } = payload.params[0];
      console.log('session update')
    });
    
    connector.on("disconnect", (error, payload) => {
      if (error) {
        throw error;
      }
      console.log('disconnected')
    
      // Delete connector
    });
    return connector
}