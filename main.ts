import readline from 'readline';
import { executeCommand } from './index';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log("🤖 Hello! I'm your AI assistant for coin sdk operations.");
console.log("Ask me anything, and I'll help you execute your commands!");
console.log("Type 'exit', 'quit', or 'bye' to end the session.");

function askQuestion() {
    rl.question("💬 What would you like me to do? ", async (prompt) => {
        if (['exit', 'quit', 'bye'].includes(prompt.toLowerCase())) {
            console.log("👋 Goodbye! Have a great day!");
            rl.close();
            return;
        }

        try {
            const result = await executeCommand(prompt);
            console.log("✅ Here's the result:", result);
        } catch (error) {
            console.error("⚠️ Oops! Something went wrong:", error);
        }

        askQuestion(); // Ask the next question
    });
}

askQuestion();