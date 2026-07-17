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
exports.ChatbotBuilder = exports.INTENTS = void 0;
const groq_1 = require("../config/groq");
exports.INTENTS = {
    PRODUCT_DETAILS: 'PRODUCT_DETAILS',
    GET_ORDER: 'GET_ORDER',
    CANCEL_ORDER: 'CANCEL_ORDER',
    GENERAL_QA: 'GENERAL_QA',
};
class ChatbotBuilder {
    constructor(userQuery, user) {
        this.actions = new Map();
        this.userQuery = userQuery;
        this.user = user;
    }
    // generate Intent
    generateIntent() {
        return __awaiter(this, void 0, void 0, function* () {
            const routingResponse = yield groq_1.groq.chat.completions.create({
                model: groq_1.groqAiModel,
                messages: [
                    {
                        role: 'system',
                        content: `You are an e-commerce request planner.
    
    Analyze the user's message and produce one or more execution contexts.
    
    Intent must be exactly one of:
    
    - PRODUCT_DETAILS
    - GET_ORDER
    - CANCEL_ORDER
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
                        content: this.userQuery,
                    },
                ],
                temperature: 0,
            });
            const result = JSON.parse(routingResponse.choices[0].message.content);
            return result.contexts;
        });
    }
    // Register new action
    addAction(intent, config, cb) {
        this.actions.set(intent, {
            intent,
            config,
            cb,
        });
        return this;
    }
    removeAction(intent) {
        this.actions.delete(intent);
        return this;
    }
    getAction(intent) {
        return this.actions.get(intent);
    }
    runAction(intent, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const action = this.actions.get(intent);
            if (!action) {
                return {
                    intentType: intent,
                    error: {
                        code: 'ACTION_NOT_FOUND',
                        message: 'Action not found please try again',
                    },
                };
            }
            // Validate input
            const validatedInput = action.config.inputSchema.parse(input);
            // Execute callback
            const result = yield action.cb(validatedInput);
            // Validate output
            return action.config.outputSchema.parse(result);
        });
    }
    //  Generate intent + execute automatically
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.generateIntent();
            return Promise.all(contexts.map((context) => __awaiter(this, void 0, void 0, function* () {
                return ({
                    intent: context.intent,
                    result: yield this.runAction(context.intent, {
                        prompt: context.userQuery,
                        email: this.user.email,
                        orderId: context.orderId,
                        intent: context.intent,
                    }),
                });
            })));
        });
    }
    // Debug
    listActions() {
        return [...this.actions.keys()];
    }
}
exports.ChatbotBuilder = ChatbotBuilder;
