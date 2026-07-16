import { z, ZodTypeAny } from 'zod';
import { groq, groqAiModel } from '../config/groq';

type TUser = {
  name: string;
  email: string;
};

export const INTENTS = {
  PRODUCT_DETAILS: 'PRODUCT_DETAILS',
  GET_ORDER: 'GET_ORDER',
  CANCEL_ORDER: 'CANCEL_ORDER',
  GENERAL_QA: 'GENERAL_QA',
} as const;

export type TIntent = keyof typeof INTENTS;

type TAction<
  TInput extends ZodTypeAny = ZodTypeAny,
  TOutput extends ZodTypeAny = ZodTypeAny,
> = {
  intent: string;

  config: {
    title?: string;
    description?: string;
    inputSchema: TInput;
    outputSchema: TOutput;
  };

  cb: (input: z.infer<TInput>) => Promise<z.infer<TOutput>> | z.infer<TOutput>;
};

type TIntentContext = {
  intent: TIntent;
  userQuery: string;
  orderId: string | null;
};

export class ChatbotBuilder {
  public readonly userQuery: string;

  private readonly user: TUser;

  private actions = new Map<string, TAction>();

  constructor(userQuery: string, user: TUser) {
    this.userQuery = userQuery;
    this.user = user;
  }

  // generate Intent
  async generateIntent(): Promise<TIntentContext[]> {
    const routingResponse = await groq.chat.completions.create({
      model: groqAiModel,

      messages: [
        {
          role: 'system',
          content: `You are an e-commerce request planner.
    
    Analyze the user's message and produce one or more execution contexts.
    
    Intent must be exactly one of:
    
    - PRODUCT_DETAILS
    - GET_ORDER
    - CANCEL_ORDER
    - LIST_ORDER
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

    const result = JSON.parse(
      routingResponse.choices[0].message.content as string,
    );

    return result.contexts;
  }

  // Register new action
  addAction<TInput extends ZodTypeAny, TOutput extends ZodTypeAny>(
    intent: string,
    config: {
      title?: string;
      description?: string;
      inputSchema: TInput;
      outputSchema: TOutput;
    },
    cb: (
      input: z.infer<TInput>,
    ) => Promise<z.infer<TOutput>> | z.infer<TOutput>,
  ): this {
    this.actions.set(intent, {
      intent,
      config,
      cb,
    });

    return this;
  }

  removeAction(intent: string): this {
    this.actions.delete(intent);
    return this;
  }

  getAction(intent: string): TAction | undefined {
    return this.actions.get(intent);
  }

  async runAction(intent: string, input: unknown) {
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
    const result = await action.cb(validatedInput);

    // Validate output
    return action.config.outputSchema.parse(result);
  }

  //  Generate intent + execute automatically

  async run() {
    const contexts = await this.generateIntent();

    return Promise.all(
      contexts.map(async (context) => ({
        intent: context.intent,
        result: await this.runAction(context.intent, {
          prompt: context.userQuery,
          email: this.user.email,
          orderId: context.orderId,
          intent: context.intent,
        }),
      })),
    );
  }

  // Debug
  listActions() {
    return [...this.actions.keys()];
  }
}
