import { Request, Response } from 'express';
import catchAsync from '../../../utils/catchAsync';
import { ChatbotBuilder } from '../../../builder/ChatBotBuilder';
import sendResponse from '../../../utils/sendResponse';
import httpStatus from 'http-status';
import z from 'zod';
import { orderAssistent, productDetailsAssistent } from '../v1/intentRouter/intent.assistent';

const chatBotController = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { prompt } = req.body;

  // initialized chatbot class
  const chatBotTools = new ChatbotBuilder(prompt, {
    name: user.name,
    email: user.email,
  });

  chatBotTools.addAction(
    'PRODUCT_DETAILS',
    {
      title: 'Product details',
      description: '...',

      inputSchema: z.object({
        prompt: z.string(),
      }),

      outputSchema: z.object({
        intentType: z.string(),
        data: z.array(z.any()),
        message: z.string().nullable(),
      }),
    },

    async ({ prompt }) => {
      return productDetailsAssistent(prompt);
    },
  );

  chatBotTools.addAction(
    'ORDER_DETAILS',
    {
      title: 'order details',
      description: '...',

      inputSchema: z.object({
        prompt: z.string(),
        email: z.string()
      }),

      outputSchema: z.object({
        intentType: z.string(),
        message: z.string().nullable(),
        data: z.any().optional()
      }),
    },

    async ({ prompt, email }) => {
      const result = await orderAssistent(prompt, email);
      return {
        intentType: result.intentType,
        message: result.message || null,
        data: result.data,
      };
    },
  );

  const botResponse = await chatBotTools.run();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Successfully generate Intent',
    data: botResponse,
  });
});

export default chatBotController;
