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
    PRODUCT_LIST: 'PRODUCT_LIST',
    PRODUCT_DETAILS: 'PRODUCT_DETAILS',
    ORDER_LIST: 'ORDER_LIST',
    TRACK_ORDER: 'TRACK_ORDER',
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
            const intents = Array.from(this.actions.values())
                .map((action) => `- ${action.intent}`)
                .join('\n');
            const routingResponse = yield groq_1.groq.chat.completions.create({
                model: groq_1.groqAiModel,
                messages: [
                    {
                        role: 'system',
                        content: `You are an e-commerce request planner.

Convert the user's message into execution contexts.

${intents}

Rules:
- Fix obvious spelling and grammar without changing the user's intent.
- Normalize product, brand, and e-commerce terms.
- Split only independent requests.
- Keep comparisons, filters, quantities, prices, and attributes in the same context.
- Extract the Order ID if present; otherwise use null.
- Do not answer the user.
- Do not invent information.
- Return exactly one JSON object matching the schema.
- Do not include any explanation.
- Do not include markdown.
- Do not wrap the response in \`\`\` or \`\`\`json.
- Return only raw JSON that can be parsed directly with JSON.parse().

Schema:
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
