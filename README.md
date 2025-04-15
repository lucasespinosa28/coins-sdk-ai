# coins-sdk-ai

AI-powered tools for interacting with Zora's coin SDK and other blockchain operations.

## Running the App

To run the app using [Bun](https://bun.sh/), use the following command:

```bash
bun run main.ts
```

## example using app
```bash
🤖 Hello! I am your AI assistant for coin sdk operations.
Ask me anything, and I will help you execute your commands!
💬 What would you like me to do?
buy 0x8a7f3b2c1d9e4a6b7c5d8e9f2a3b4c5d6e7f8a9b 0.0001 to 0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0
✅ Here is the result: The purchase was successful! Here are the details of the transaction:

- **Transaction Hash:** `0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8`
- **Block Number:** `28950703`
- **Gas Used:** `0.000000000000301656`
- **Effective Gas Price:** `0.000000000002041794`

### Trade Details:
- **Buyer:** `0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0`
- **Recipient:** `0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0`
- **Coins Purchased:** `78854.51` (approximately)
- **Currency:** `0x5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6`
- **Amount Fee:** `0.000001`
- **Amount Sold:** `0.000099`
```

## Usage

```typescript
import { processMessage } from 'coins-sdk-ai';

// Use any of the available tools
const result = await executeCommand("your command here");
```

## Available Tools

### Trade Coin
```typescript
// Buy or sell coins
const result = await executeCommand("buy 0x8a7f3b2c1d9e4a6b7c5d8e9f2a3b4c5d6e7f8a9b 0.0001 to 0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0");
```

### Create Coin
```typescript
// Create a new coin
const result = await executeCommand("create coin with name 'old computer' and symbol 'OCT' and payout recipient 0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0 uri ipfs://bafkreic6oovc2vmoeujwyznz4hb6v74iazmq32m46fl4alfh3rpjdsmbua");
```

### Transfer NFT
```typescript
// Transfer an NFT
const result = await executeCommand("transfer NFT 0 from 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 to 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 on contract 0x0b306bf915c4d645ff596e518faf3f9669b97016");
```

### Transfer Token
```typescript
// Transfer ERC20 tokens
const result = await executeCommand("transfer 0.1 tokens to 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 on contract 0xe7f1725e7734ce288f8367e1bb143e90bb3f0512");
```

## Environment Variables

The following environment variables are required:

- `OPENAI_API_KEY`: Your OpenAI API key
- `MNEMONIC` or `PRIVATE_KEY`: Your wallet mnemonic or private key
- `RPC_URL`: Your Ethereum RPC URL

## License

MIT