import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { createCoin } from "@zoralabs/coins-sdk";
import { type Address } from "viem";
import { myPublicClient, myWalletClient } from "./utils/wallet";


type CreateCoinArgs = {
  name: string;             // The name of the coin (e.g., "My Awesome Coin")
  symbol: string;           // The trading symbol for the coin (e.g., "MAC")
  uri: string;              // Metadata URI (an IPFS URI is recommended)
  owners?: Address[];       // Optional array of owner addresses, defaults to [payoutRecipient]
  tickLower?: number;       // Optional tick lower for Uniswap V3 pool, defaults to -199200
  payoutRecipient: Address; // Address that receives creator earnings
  platformReferrer?: Address; // Optional platform referrer address, earns referral fees
  initialPurchaseWei?: bigint; // Optional initial purchase amount in wei
};

const createCoinTool = tool(
  async (args: CreateCoinArgs) => {
    try {
      const result = await createCoin(args, myWalletClient, myPublicClient);

      return `Coin created successfully!
Transaction hash: ${result.hash}
Coin address: ${result.address}
Deployment details: ${JSON.stringify(result.deployment)}`;
    } catch (error) {
      return `Error creating coin: ${error}`;
    }
  },
  {
    name: "createCoin",
    schema: z.object({
      name: z.string().describe("The name of the coin (e.g., 'My Awesome Coin')"),
      symbol: z.string().describe("The trading symbol for the coin (e.g., 'MAC')"),
      uri: z.string().describe("Metadata URI (an IPFS URI is recommended)"),
      owners: z.array(z.string()).optional().describe("Optional array of owner addresses, defaults to [payoutRecipient]"),
      tickLower: z.number().optional().describe("Optional tick lower for Uniswap V3 pool, defaults to -199200"),
      payoutRecipient: z.string().describe("Address that receives creator earnings"),
      platformReferrer: z.string().optional().describe("Optional platform referrer address, earns referral fees"),
      initialPurchaseWei: z.bigint().optional().describe("Optional initial purchase amount in wei")
    }),
    description: "Creates a new coin on Base network using Zora's coin SDK."
  }
);

export { createCoinTool }; 