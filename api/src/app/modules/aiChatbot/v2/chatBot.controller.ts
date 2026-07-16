import { Request, Response } from 'express';
import catchAsync from '../../../utils/catchAsync';
import { ChatbotBuilder, INTENTS } from '../../../builder/ChatBotBuilder';
import sendResponse from '../../../utils/sendResponse';
import httpStatus from 'http-status';
import z from 'zod';
import { productDetailsHandler, getOrderHandler, cancelOrderHandler, generalQuestionHandler } from './actionHandler';

const chatBotController = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { prompt } = req.body;

  // initialized chatbot class
  const chatBotTools = new ChatbotBuilder(prompt, {
    name: user.name,
    email: user.email,
  });

  // add actions
  chatBotTools.addAction(
    INTENTS.PRODUCT_DETAILS,
    {
      title: 'Product details',
      description: '...',

      inputSchema: z.object({
        prompt: z.string(),
        intent: z.enum(Object.values(INTENTS) as [string, ...string[]]),
      }),

      outputSchema: z.object({
        intentType: z.string(),
        data: z.any().optional(),
        error: z
          .object({
            code: z.string(),
            message: z.string(),
          })
          .optional(),
      }),
    },

    async ({ prompt, intent }) => {
      const result = await productDetailsHandler(prompt, intent as keyof typeof INTENTS);
      return result;
    },
  );

  chatBotTools.addAction(
    INTENTS.GET_ORDER,
    {
      title: 'Get order data from db',
      description: '...',

      inputSchema: z.object({
        email: z.string(),
        orderId: z.string().nullable().optional(),
        intent: z.enum(Object.values(INTENTS) as [string, ...string[]]),
      }),

      outputSchema: z.object({
        intentType: z.string(),
        data: z.any().optional(),
        error: z
          .object({
            code: z.string(),
            message: z.string(),
          })
          .optional(),
      }),
    },
    async ({ orderId, email, intent }) => {
      const result = await getOrderHandler(
        email,
        intent as keyof typeof INTENTS,
        orderId as string,
      );
      return result;
    },
  );

   chatBotTools.addAction(
    INTENTS.CANCEL_ORDER,
    {
      title: 'Perform order canceling',
      description: '...',

      inputSchema: z.object({
        email: z.string(),
        orderId: z.string().nullable().optional(),
        intent: z.enum(Object.values(INTENTS) as [string, ...string[]]),
      }),

      outputSchema: z.object({
        intentType: z.string(),
        data: z.any().optional(),
        error: z
          .object({
            code: z.string(),
            message: z.string(),
          })
          .optional(),
      }),
    },
    async ({ orderId, email, intent }) => {
      const result = await cancelOrderHandler({
        email : email,
        intent: intent as keyof typeof INTENTS,
        orderId: orderId as string}
      );
      return result;
    },
  );

  chatBotTools.addAction(
    INTENTS.GENERAL_QA,
    {
      title: 'general QA',
      description: '...',

      inputSchema: z.object({
        prompt: z.string(),
        intent: z.enum(Object.values(INTENTS) as [string, ...string[]]),
      }),

      outputSchema: z.object({
        intentType: z.string(),
          data: z.any().optional(),
        error: z
          .object({
            code: z.string(),
            message: z.string(),
          })
          .optional()
      }),
    },

    async ({ prompt, intent }) => {
      const result = await generalQuestionHandler({prompt, intent: intent as keyof typeof INTENTS});
      return result;
    },
  );

  // get tool Response
  const botResponse = await chatBotTools.run();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: botResponse,
  });
});

export default chatBotController;
