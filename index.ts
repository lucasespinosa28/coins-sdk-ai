import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { tradeCoinTool } from "./tools/trade";
import { createCoinTool } from "./tools/create";
import { transferNFTTool } from "./tools/transferNFT";
import { transferTokenTool } from "./tools/transferToken";

if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
}

const tools = [tradeCoinTool, createCoinTool, transferNFTTool, transferTokenTool];

const llm = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
    apiKey: process.env.OPENAI_API_KEY,
});

const llmWithTools = llm.bindTools(tools);

const toolsByName = {
    tradeCoin: tradeCoinTool,
    createCoin: createCoinTool,
    transferNFT: transferNFTTool,
    transferToken: transferTokenTool,
};

async function executeCommand(prompt: string): Promise<string> {
    let messages = [new HumanMessage(prompt)];
    const aiMessage = await llmWithTools.invoke(messages);
    messages.push(aiMessage)
    if (aiMessage.tool_calls) {
        for (const toolCall of aiMessage.tool_calls) {
            const selectedTool = toolsByName[toolCall.name as keyof typeof toolsByName];
            const toolMessage = await selectedTool.invoke(toolCall);
            messages.push(toolMessage);
        }
    }
    const result = await llmWithTools.invoke(messages);
    return result.content.toString();
}

export { executeCommand, tradeCoinTool, createCoinTool, transferNFTTool, transferTokenTool };   