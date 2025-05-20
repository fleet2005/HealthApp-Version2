import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import cors from 'cors';

console.log('Starting server initialization...');

// Load environment variables
dotenv.config();
console.log('Environment variables loaded');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
console.log('Middleware configured');

// Initialize Google AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
console.log('Google AI initialized');

const model = 'gemini-1.5-flash-8b';

// Controller function for chat
const handleChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lang, detail } = req.body;
    
    if (!detail) {
      res.status(400).json({ 
        message: "Message is required" 
      });
      return;
    }

    const contents = [
      {
        role: 'user',
        parts: [{ text: detail }],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      contents,
    });

    let fullResponse = '';
    for await (const chunk of response) {
      fullResponse += chunk.text;
    }

    res.json({
      response: {
        result: fullResponse
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      message: "Internal server error" 
    });
  }
};

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Chatbot API is running' });
});

app.post('/chatbot', handleChat);
app.post('/chatbot/', handleChat);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('=================================');
  console.log(`Server is running on port ${PORT}`);
  console.log('=================================');
}); 