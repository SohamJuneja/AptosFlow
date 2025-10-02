import OpenAI from 'openai';

export default async function handler(req, res) {
  try {
    // Check API key
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: "GROQ_API_KEY not found",
        hint: "Add GROQ_API_KEY=your_key_here to your .env.local file"
      });
    }

    // Mask API key for security
    const maskedKey = apiKey.substring(0, 10) + "...";
    
    const groq = new OpenAI({
      apiKey,
      baseURL: "https://api.groq.com/openai/v1"
    });
    
    // Test the API
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: "Reply with just: Groq API Working!"
        }
      ]
    });
    
    const response = completion.choices[0].message.content;
    
    return res.status(200).json({ 
      success: true,
      message: "Groq API is working perfectly! 🚀",
      apiKeyPrefix: maskedKey,
      testResponse: response,
      model: completion.model,
      usage: completion.usage
    });
    
  } catch (error) {
    const maskedKey = process.env.GROQ_API_KEY 
      ? process.env.GROQ_API_KEY.substring(0, 10) + "..." 
      : "Not found";
      
    return res.status(500).json({ 
      success: false,
      error: error.message,
      apiKeyPrefix: maskedKey,
      hint: "Get your API key from https://console.groq.com/keys"
    });
  }
}