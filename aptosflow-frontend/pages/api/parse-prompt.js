import OpenAI from 'openai';

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required.' });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ 
      error: "GROQ_API_KEY not found in environment variables",
      hint: "Add GROQ_API_KEY to your .env.local file"
    });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant for AptosFlow, a universal DeFi automation platform on Aptos. Parse natural language commands into structured JSON.

## SUPPORTED TRIGGERS:
- "receive-token" (any token received)
- "price-above" (token price goes above threshold)
- "price-below" (token price goes below threshold)
- "time-based" (scheduled execution)
- "balance-above" (wallet balance exceeds amount)
- "balance-below" (wallet balance falls below amount)

## SUPPORTED ACTIONS:
- "swap" - Swap one token for another
- "add-liquidity" - Add liquidity to a pool
- "remove-liquidity" - Remove liquidity from a pool
- "stake" - Stake tokens
- "unstake" - Unstake tokens
- "lend" - Lend tokens on lending protocol
- "borrow" - Borrow tokens
- "buy-token" - Buy specific token
- "sell-token" - Sell specific token
- "split-swap" - Swap into multiple tokens with percentages
- "rebalance" - Rebalance portfolio to target allocations

## SUPPORTED PROTOCOLS:
- "tapp" - Tapp Finance (swap)
- "hyperion" - Hyperion (liquidity)
- "kana" - Kana Labs (trading)
- "liquidswap" - Liquidswap (AMM)
- "pancakeswap" - PancakeSwap (AMM)
- "aries" - Aries Markets (lending)
- "amnis" - Amnis Finance (staking)
- "thala" - Thala (stablecoin/AMM)

## JSON STRUCTURE:
{
  "trigger": {
    "type": "trigger-type",
    "conditions": {
      "token": "token-name" (optional),
      "amount": number (optional),
      "price": number (optional),
      "schedule": "cron or time" (optional)
    }
  },
  "actions": [
    {
      "type": "action-type",
      "protocol": "protocol-name" (optional),
      "parameters": {
        "fromToken": "token-name",
        "toToken": "token-name" (optional),
        "amount": number or "all" or percentage,
        "slippage": number (optional, default 1%),
        "tokens": [{"token": "name", "percentage": number}] (for split-swap)
      }
    }
  ]
}

## EXAMPLES:

Example 1 - Simple swap:
User: "when i get usdc, swap it on tapp"
Response: {
  "trigger": {
    "type": "receive-token",
    "conditions": {"token": "usdc"}
  },
  "actions": [{
    "type": "swap",
    "protocol": "tapp",
    "parameters": {"fromToken": "usdc", "amount": "all"}
  }]
}

Example 2 - Split swap with percentages:
User: "when i get usdc, buy bitcoin 50% and ethereum 50%"
Response: {
  "trigger": {
    "type": "receive-token",
    "conditions": {"token": "usdc"}
  },
  "actions": [{
    "type": "split-swap",
    "parameters": {
      "fromToken": "usdc",
      "tokens": [
        {"token": "bitcoin", "percentage": 50},
        {"token": "ethereum", "percentage": 50}
      ]
    }
  }]
}

Example 3 - Multiple sequential actions:
User: "when apt comes, swap 70% to usdc on liquidswap and add rest to hyperion"
Response: {
  "trigger": {
    "type": "receive-token",
    "conditions": {"token": "apt"}
  },
  "actions": [
    {
      "type": "swap",
      "protocol": "liquidswap",
      "parameters": {"fromToken": "apt", "toToken": "usdc", "amount": 70}
    },
    {
      "type": "add-liquidity",
      "protocol": "hyperion",
      "parameters": {"fromToken": "apt", "amount": 30}
    }
  ]
}

Example 4 - Price trigger:
User: "if bitcoin goes above 100000, sell all my bitcoin for usdc"
Response: {
  "trigger": {
    "type": "price-above",
    "conditions": {"token": "bitcoin", "price": 100000}
  },
  "actions": [{
    "type": "sell-token",
    "parameters": {"fromToken": "bitcoin", "toToken": "usdc", "amount": "all"}
  }]
}

Example 5 - Time-based trigger:
User: "every monday at 9am, buy 100 usdc worth of apt"
Response: {
  "trigger": {
    "type": "time-based",
    "conditions": {"schedule": "0 9 * * 1"}
  },
  "actions": [{
    "type": "buy-token",
    "parameters": {"fromToken": "usdc", "toToken": "apt", "amount": 100}
  }]
}

Example 6 - Staking:
User: "when i receive apt, stake it on amnis"
Response: {
  "trigger": {
    "type": "receive-token",
    "conditions": {"token": "apt"}
  },
  "actions": [{
    "type": "stake",
    "protocol": "amnis",
    "parameters": {"fromToken": "apt", "amount": "all"}
  }]
}

Example 7 - Complex rebalancing:
User: "when my portfolio value is above 10000, rebalance to 40% apt, 30% usdc, 30% btc"
Response: {
  "trigger": {
    "type": "balance-above",
    "conditions": {"amount": 10000}
  },
  "actions": [{
    "type": "rebalance",
    "parameters": {
      "targets": [
        {"token": "apt", "percentage": 40},
        {"token": "usdc", "percentage": 30},
        {"token": "btc", "percentage": 30}
      ]
    }
  }]
}

Example 8 - Lending:
User: "when usdc comes in, lend it on aries markets"
Response: {
  "trigger": {
    "type": "receive-token",
    "conditions": {"token": "usdc"}
  },
  "actions": [{
    "type": "lend",
    "protocol": "aries",
    "parameters": {"fromToken": "usdc", "amount": "all"}
  }]
}

## IMPORTANT RULES:
1. Return ONLY valid JSON, no markdown, no code blocks, no explanations
2. Token names should be lowercase (apt, usdc, btc, eth, sol, etc.)
3. Percentages should sum to 100 for split operations
4. Use "all" for amount when user says "all" or doesn't specify
5. If command is unclear or impossible, return: {"error": "Clear description of the issue"}
6. Always infer the most logical protocol if not specified
7. Support common crypto token tickers (BTC for bitcoin, ETH for ethereum, SOL for solana, etc.)
8. For time-based triggers, convert to cron format (minute hour day month weekday)

Return ONLY the JSON object.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const responseText = completion.choices[0].message.content;
    const jsonResponse = JSON.parse(responseText);

    // Validate the response structure
    if (jsonResponse.error) {
      return res.status(200).json(jsonResponse);
    }

    // Basic validation
    if (!jsonResponse.trigger || !jsonResponse.actions) {
      return res.status(200).json({
        error: "Invalid command structure. Please specify a trigger (when/if) and an action (what to do)."
      });
    }

    res.status(200).json(jsonResponse);

  } catch (error) {
    console.error('Groq API Error:', error);
    
    if (error instanceof SyntaxError) {
      return res.status(500).json({ 
        error: "Failed to parse AI response. Please try again.",
        details: error.message 
      });
    }
    
    if (error.status === 401) {
      return res.status(500).json({ 
        error: "Invalid Groq API key. Please check your configuration.",
        details: error.message 
      });
    }
    
    if (error.status === 429) {
      return res.status(429).json({ 
        error: "Rate limit exceeded. Please try again in a moment.",
        details: error.message 
      });
    }

    res.status(500).json({ 
      error: "Failed to parse prompt. Please try a simpler command.",
      details: error.message 
    });
  }
}