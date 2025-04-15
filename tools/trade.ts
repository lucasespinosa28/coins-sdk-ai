import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { tradeCoin } from "@zoralabs/coins-sdk";
import { type Address, parseEther, formatEther } from "viem";
import { myWalletClient, myPublicClient } from "./utils/wallet";
import processBigIntValues from "./utils/convertBigInt";
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
      params.args.orderSize = parseEther(params.args.orderSize.toString());
      if (params.args.minAmountOut === undefined) {
        params.args.minAmountOut = 0n;
      }
      const result = await tradeCoin(params, myWalletClient, myPublicClient);

      if (!result.trade) {
        throw new Error("Trade result is undefined");
      }

      // Process the entire result object to handle BigInt values
      const processedResult = processBigIntValues({
        status: "success",
        transaction: {
          hash: result.hash,
          status: result.receipt.status,
          blockNumber: result.receipt.blockNumber,
          gasUsed: result.receipt.gasUsed,
          effectiveGasPrice: result.receipt.effectiveGasPrice
        },
        trade: result.trade
      });

      return JSON.stringify(processedResult, null, 2);
    } catch (error) {
      return JSON.stringify({
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error occurred"
      });
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