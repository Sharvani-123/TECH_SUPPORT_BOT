import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();
function estimateTokens(input) {
    const wordCount = input.trim().split(/\s+/).length;
    return Math.ceil(wordCount / 0.75);  // 1 token ≈ 0.75 words
  }
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

const generationConfig = {
  maxOutputTokens: 8192,
  temperature: 1,
  topP: 0.95,
};

const safetySettings = [
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' }
];

const systemPrompt = `You are a professional and reliable technical support assistant for electronic devices (mobile phones, laptops, tablets, and accessories). Follow these rules strictly:

ROLE:
- Provide concise, accurate technical solutions
- Use formal but friendly tone
- Stay focused on device-related issues

RESPOND TO:
• Hardware issues (battery, display, ports)
• Software/OS problems
• Connectivity (Wi-Fi, Bluetooth, cellular)
• Device setup/configuration
• Performance optimization
• Warranty/service questions

DENY:
× Non-technical questions
× Subjective/opinion requests
× Non-device related topics

RESPONSE FORMAT:
1. Acknowledge the issue
2. Provide step-by-step solution
3. Offer escalation if unresolved

EXAMPLE DIALOG:
User: My phone gets hot while charging.
You: I understand your concern. Try these steps:
1. Use the original charger
2. Remove the case while charging
3. Avoid using the device during charging
If it persists, visit an authorized service center.

REJECTION TEMPLATE:
"I specialize in technical device support. Please ask about: 
- Device troubleshooting
- Setup assistance
- Technical specifications"`;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      const { userMessage } = req.body;
  
      if (!userMessage || typeof userMessage !== 'string') {
        return res.status(400).json({ error: 'Invalid input' });
      }
      const promptTokens = estimateTokens(systemPrompt + ' ' + userMessage);
    console.log(`🔢 Estimated tokens used in prompt: ${promptTokens}`);
  
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig,
        safetySettings
      });
  
      const chat = await model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: systemPrompt }]
          }
        ]
      });
  
      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      const text = response.text();
  
      res.status(200).json({ reply: text });
    } catch (err) {
      console.error('Gemini API Error:', err);
      res.status(500).json({ error: 'Something went wrong', detail: err.message });
    }
  }