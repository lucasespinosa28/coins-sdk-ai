import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { tradeCoin } from "@zoralabs/coins-sdk";
import { type Address, parseEther } from "viem";
import { walletClient, publicClient } from "./wallet";


type TradeParams = {
  direction: "sell" | "buy";  // The trade direction
  target: Address;            // The target coin contract address
  args: {
    recipient: Address;       // The recipient of the trade output
    orderSize: bigint;        // The size of the order
    minAmountOut?: bigint;    // Optional minimum amount to receive
    sqrtPriceLimitX96?: bigint; // Optional price limit for the trade
    tradeReferrer?: Address;  // Optional referrer address for the trade
  };
};


const tradeCoinTool = tool(
  async (params: TradeParams) => {
    try {
      const result = await tradeCoin(params, walletClient, publicClient);

      return `Trade executed successfully!
Transaction hash: ${result.hash}
Trade details: ${JSON.stringify(result.trade)}
Receipt: ${JSON.stringify(result.receipt)}`;
    } catch (error) {
      return `Error executing trade: ${error}`;
    }
  },
  {
    name: "tradeCoin",
    schema: z.object({
      direction: z.enum(["buy", "sell"]).describe("The trade direction (buy or sell)"),
      target: z.string().describe("The target coin contract address"),
      args: z.object({
        recipient: z.string().describe("The recipient of the trade output"),
        orderSize: z.string().describe("The size of the order in ETH (e.g., '0.001')"),
        minAmountOut: z.string().optional().describe("Optional minimum amount to receive in ETH (e.g., '0.0001')"),
        sqrtPriceLimitX96: z.string().optional().describe("Optional price limit for the trade"),
        tradeReferrer: z.string().optional().describe("Optional referrer address for the trade")
      })
    }),
    description: "Executes a trade (buy or sell) for a specific coin on Base network using Zora's coin SDK."
  }
);

export { tradeCoinTool }; 