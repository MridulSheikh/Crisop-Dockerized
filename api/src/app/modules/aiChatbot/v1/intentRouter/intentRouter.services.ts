import {
  generalQuestion,
  orderAssistent,
  productDetailsAssistent,
} from './intent.assistent';
import { groq, groqAiModel } from '../../../../config/groq';

type TContext = {
  intent: string;
  userQuery: string;
  orderId: string;
};

export const intentRouter = async (
  contexts: TContext[],
  userPrompt: string,
  userEmail: string,
) => {
  const result = {
    userPrompt: userPrompt,
    botResponse: [] as any[],
  };

  for (const context of contexts) {
    switch (context.intent) {
      case 'PRODUCT_DETAILS':
        result.botResponse.push(await productDetailsAssistent(context.userQuery));
        break;

      case 'ORDER_DETAILS':
        result.botResponse.push(await orderAssistent(userPrompt, userEmail));
        break;

      case 'GENERAL_QA':
        result.botResponse.push(await generalQuestion(userPrompt));
        break;

      default:
        result.botResponse.push({
          intentResponse: 'Sorry, I could not understand your request.',
        });
        break;
    }
  }

  return result;
};

export const GenerateContext = async (prompt: string) => {
  const routingResponse = await groq.chat.completions.create({
    model: groqAiModel,

    messages: [
      {
        role: 'system',
        content: `You are an e-commerce request planner.

Analyze the user's message and produce one or more execution contexts.

Intent must be exactly one of:

- PRODUCT_DETAILS
- ORDER_DETAILS
- GENERAL_QA

Rules:

- First, correct obvious spelling mistakes, typing errors, and common grammatical mistakes.
- Preserve the user's original intent after correction.
- Normalize product names, brand names, and common e-commerce terms when possible.
- Split only if the user has multiple independent requests.
- Do NOT split simple filters, comparisons, or attributes of the same request.
- Extract orderId if present; otherwise return null.
- Never answer the user's question.
- Never invent products, brands, categories, or order IDs.
- Return valid JSON only.
- Do not include markdown, explanations, or extra text.

Examples

Input:
"show fis and bef"

Output:
{
  "contexts": [
    {
      "intent": "PRODUCT_DETAILS",
      "userQuery": "show fish",
      "orderId": null
    },
    {
      "intent": "PRODUCT_DETAILS",
      "userQuery": "show beef",
      "orderId": null
    }
  ]
}

Input:
"show pomfrat fish under 1000"

Output:
{
  "contexts": [
    {
      "intent": "PRODUCT_DETAILS",
      "userQuery": "show pomfret fish under 1000",
      "orderId": null
    }
  ]
}

Input:
"trak ordr #123"

Output:
{
  "contexts": [
    {
      "intent": "ORDER_DETAILS",
      "userQuery": "track order #123",
      "orderId": "123"
    }
  ]
}

Input:
"show fish and cancle order #123"

Output:
{
  "contexts": [
    {
      "intent": "PRODUCT_DETAILS",
      "userQuery": "show fish",
      "orderId": null
    },
    {
      "intent": "ORDER_DETAILS",
      "userQuery": "cancel order #123",
      "orderId": "123"
    }
  ]
}

Return exactly this JSON format:

{
  "contexts": [
    {
      "intent": "PRODUCT_DETAILS",
      "userQuery": "string",
      "orderId": null
    }
  ]
}`,
      },

      {
        role: 'user',
        content: prompt,
      },
    ],

    temperature: 0,
  });

  const result = JSON.parse(
    routingResponse.choices[0].message.content as string,
  );

  return result.contexts;
};
