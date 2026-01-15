import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.api;
console.log("Using API Key:", apiKey ? apiKey.substring(0, 10) + "..." : "UNDEFINED");

const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
    console.log(`\nTesting model: ${modelName}`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, are you there?");
        const response = await result.response;
        console.log(`SUCCESS [${modelName}]:`, response.text());
        return true;
    } catch (error) {
        console.error(`FAILED [${modelName}]:`, error.message);
        return false;
    }
}

async function run() {
    // Try latest flash first, then pro
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];

    for (const m of models) {
        if (await testModel(m)) break;
    }
}

run();
