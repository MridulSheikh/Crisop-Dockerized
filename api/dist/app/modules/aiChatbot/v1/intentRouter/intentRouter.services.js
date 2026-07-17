"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateContext = exports.intentRouter = void 0;
const intent_assistent_1 = require("./intent.assistent");
const groq_1 = require("../../../../config/groq");
const intentRouter = (contexts, userPrompt, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const result = {
        userPrompt: userPrompt,
        botResponse: [],
    };
    for (const context of contexts) {
        switch (context.intent) {
            case 'PRODUCT_DETAILS':
                result.botResponse.push(yield (0, intent_assistent_1.productDetailsAssistent)(context.userQuery));
                break;
            case 'ORDER_DETAILS':
                result.botResponse.push(yield (0, intent_assistent_1.orderAssistent)(userPrompt, userEmail));
                break;
            case 'GENERAL_QA':
                result.botResponse.push(yield (0, intent_assistent_1.generalQuestion)(userPrompt));
                break;
            default:
                result.botResponse.push({
                    intentResponse: 'Sorry, I could not understand your request.',
                });
                break;
        }
    }
    return result;
});
exports.intentRouter = intentRouter;
const GenerateContext = (prompt) => __awaiter(void 0, void 0, void 0, function* () {
    const routingResponse = yield groq_1.groq.chat.completions.create({
        model: groq_1.groqAiModel,
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
    const result = JSON.parse(routingResponse.choices[0].message.content);
    return result.contexts;
});
exports.GenerateContext = GenerateContext;
