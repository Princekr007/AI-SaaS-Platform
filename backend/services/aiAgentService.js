const axios = require('axios');
const cheerio = require('cheerio');
const { ChatOpenAI } = require('langchain/chat_models/openai');
const { HumanMessage } = require('langchain/schema');

require('dotenv').config();

const openai = new ChatOpenAI({
    temperature: 0.3,
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-3.5-turbo', // or gpt-4 if you have access
});

async function fetchDOM(url) {
    const response = await axios.get(url, { timeout: 10000 }); // 10s timeout
    const $ = cheerio.load(response.data);
    return $('body').text().substring(0, 3000); // limit to 3k chars
}

exports.generateTestWithAI = async (url) => {
    try {
        const domText = await fetchDOM(url);

        const prompt = `
You are an expert in Playwright test automation. Based on the following webpage content, generate a basic Playwright test script in JavaScript.

Page Content:
"""${domText}"""

Requirements:
- Visit the page
- Assert title or heading
- Click at least one button if possible

Only return a valid Playwright test script in JavaScript.
        `;

        const result = await openai.call([new HumanMessage(prompt)]);
        const code = result?.text || '// Failed to generate test script';
        return code;
    } catch (err) {
        console.error("🔥 AI generation error:", err);
        return '// Failed to generate test script';
    }
};
