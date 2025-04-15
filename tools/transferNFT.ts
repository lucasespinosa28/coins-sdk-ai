import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { type Address } from "viem";
import { myWalletClient, myPublicClient } from "./utils/wallet";

type TransferParams = {
  from: Address;      // The sender's address
  to: Address;        // The recipient's address
  tokenId: number;    // The token ID to transfer
  contractAddress: Address; // The NFT contract address
};

const transferNFTTool = tool(
  async (params: TransferParams) => {
    try {
      const { request: transferNFT } = await myPublicClient.simulateContract({
        account: myWalletClient.account,
        address: params.contractAddress,
        abi: [
          {
            "type": "function",
            "name": "safeTransferFrom",
            "inputs": [
              {
                "name": "from",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "to",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "tokenId",
                "type": "uint256",
                "internalType": "uint256"
              }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
          }
        ],
        functionName: "safeTransferFrom",
        args: [params.from, params.to, BigInt(params.tokenId)],
      });

      const hash = await myWalletClient.writeContract(transferNFT);
      const receipt = await myPublicClient.waitForTransactionReceipt({ hash });

      const formattedResponse = {
        status: "success",
        transaction: {
          hash,
          status: receipt.status,
          blockNumber: receipt.blockNumber.toString(),
          gasUsed: receipt.gasUsed.toString(),
          effectiveGasPrice: receipt.effectiveGasPrice.toString()
        }
      };

      return JSON.stringify(formattedResponse, null, 2);
    } catch (error) {
      return JSON.stringify({
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  },
  {
    name: "transferNFT",
    schema: z.object({
      from: z.string().describe("The sender's address"),
      to: z.string().describe("The recipient's address"),
      tokenId: z.number().describe("The token ID to transfer"),
      contractAddress: z.string().describe("The NFT contract address")
    }),
    description: "Transfers an NFT from one address to another using the safeTransferFrom function."
  }
);

export { transferNFTTool }; 