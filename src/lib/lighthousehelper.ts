import { HDNodeWallet, Wallet } from "ethers"
import lighthouse from '@lighthouse-web3/sdk'
import kavach from "@lighthouse-web3/kavach"

const signAuthMessage = async (signer: HDNodeWallet) => {
    //   const signer = new Wallet(privateKey)
    const authMessage = await kavach.getAuthMessage(signer.address)
    const signedMessage = await signer.signMessage(authMessage.message)
    const { JWT, error } = await kavach.getJWT(signer.address, signedMessage)
    return (JWT)
}

export async function lighthouseUpload(file: File) {
    const apiKey = process.env.PUBLIC_LIGHTHOUSE_API_KEY;
    const ephemeralWallet = Wallet.createRandom();
    const delegatorAddress = "0xF39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Hardcoded delegator account for testing

    const signedMessage = await signAuthMessage(ephemeralWallet)

    const response = await lighthouse.uploadEncrypted(
        file,
        apiKey,
        ephemeralWallet.address,
        signedMessage
      )
    const cid = response.data[0].Hash 
    await delegateAccess(ephemeralWallet, delegatorAddress);   
    return { type : "lighthouse", cid };
}

const delegateAccess = async (ownerWallet: HDNodeWallet, delegateAddress:string  ) => {
  const JWT = await signAuthMessage(ownerWallet);
  const nodeIds = [1, 2, 3, 4, 5];

  for (const nodeId of nodeIds) {
    const response = await fetch(`https://encryption.lighthouse.storage/api/setAllFilesAccess/${nodeId}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${JWT}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        address: ownerWallet.address,
        allFilesAccess: [delegateAddress]
      })
    });

    const data = await response.json();
    console.log(`response: `, data);
  }
};