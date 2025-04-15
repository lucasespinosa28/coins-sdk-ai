import { createWalletClient, createPublicClient, http } from "viem";
import { mnemonicToAccount, privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import type { WalletClient } from "viem"; // Import the WalletClient type

const mnemonic = process.env.MNEMONIC;
const privateKey = process.env.PRIVATE_KEY;
const rpcUrl = process.env.RPC_URL;

if (!mnemonic && !privateKey) {
  throw new Error("Either MNEMONIC or PRIVATE_KEY environment variable must be set");
}

if (!rpcUrl) {
  throw new Error("RPC_URL environment variable must be set");
}

const account = mnemonic 
  ? mnemonicToAccount(mnemonic)
  : privateKeyToAccount(privateKey as `0x${string}`);

export const myPublicClient = createPublicClient({
  chain: base,
  transport: http(rpcUrl),
});

export const myWalletClient: WalletClient = createWalletClient({ // Explicit type annotation
  account: account,
  chain: base,
  transport: http(rpcUrl),
});