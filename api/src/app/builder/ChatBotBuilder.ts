import { z, ZodTypeAny } from 'zod';
import { groq, groqAiModel } from '../config/groq';

type TUser = {
  name: string;
  email: string;
};

export const INTENTS = {
  PRODUCT_LIST: 'PRODUCT_LIST',
  PRODUCT_DETAILS: 'PRODUCT_DETAILS',
  ORDER_LIST: 'ORDER_LIST',
  TRACK_ORDER: 'TRACK_ORDER',
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
    const intents = Array.from(this.actions.values())
      .map((action) => `- ${action.intent}`)
      .join('\n');
    const routingResponse = await groq.chat.completions.create({
      model: groqAiModel,

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
