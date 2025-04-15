import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { tradeCoinTool } from "./trade";
import { createCoinTool } from "./create";

if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
}

const tools = [tradeCoinTool, createCoinTool];

const llm = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
    apiKey: process.env.OPENAI_API_KEY,
});

const llmWithTools = llm.bindTools(tools);

const toolsByName = {
    tradeCoin: tradeCoinTool,
    createCoin: createCoinTool,
};

export async function processMessage(message: string): Promise<string> {
    const messages = [new HumanMessage(message)];
    
    const aiMessage = await llmWithTools.invoke(messages);
    messages.push(aiMessage);

    if (aiMessage.tool_calls) {
        for (const toolCall of aiMessage.tool_calls) {
            if (toolCall.name in toolsByName) {
                const selectedTool = toolsByName[toolCall.name as keyof typeof toolsByName];
                const toolMessage = await selectedTool.invoke(toolCall);
                messages.push(toolMessage);
            }
        }
    }

    const aiMessage2 = await llmWithTools.invoke(messages);
    return aiMessage2.content.toString();
}

// Example usage
const result = await processMessage("Create a new NFT with name 'Test NFT' and symbol 'TEST' uri 'https://test.com' payoutRecipient ox1fsa1 initialPurchaseWei are 1n");
console.log(result);