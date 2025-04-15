import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { type Address, parseEther } from "viem";
import { myWalletClient, myPublicClient } from "./utils/wallet";

type TransferTokenParams = {
  to: Address;           // The recipient's address
  value: string;         // The amount to transfer (in ETH)
  contractAddress: Address; // The token contract address
};

const transferTokenTool = tool(
  async (params: TransferTokenParams) => {
    try {
      const { request: transferToken } = await myPublicClient.simulateContract({
        account: myWalletClient.account,
        address: params.contractAddress,
        abi: [
          {
            "type": "function",
            "name": "transfer",
            "inputs": [
              {
                "name": "to",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "value",
                "type": "uint256",
                "internalType": "uint256"
              }
            ],
            "outputs": [
              {
                "name": "",
                "type": "bool",
                "internalType": "bool"
              }
            ],
            "stateMutability": "nonpayable"
          }
        ],
        functionName: "transfer",
        args: [params.to, parseEther(params.value)],
      });

      const hash = await myWalletClient.writeContract(transferToken);
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
    name: "transferToken",
    schema: z.object({
      to: z.string().describe("The recipient's address"),
      value: z.string().describe("The amount to transfer in ETH (e.g., '0.1')"),
      contractAddress: z.string().describe("The token contract address")
    }),
    description: "Transfers ERC20 tokens from the sender to the recipient using the transfer function."
  }
);

export { transferTokenTool }; 