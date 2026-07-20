import { Request, Response } from 'express';
import catchAsync from '../../../utils/catchAsync';
import { ChatbotBuilder, INTENTS } from '../../../builder/ChatBotBuilder';
import sendResponse from '../../../utils/sendResponse';
import httpStatus from 'http-status';
import z from 'zod';
import {
  cancelOrderHandler,
  generalQuestionHandler,
  productListHandler,
  getOrderListHandler,
  productDetailsHandler,
  trackOrderHandler,
} from './actionHandler';
import { IMessage } from './inbox.interface';
import Inbox from './inbox.model';
import AppError from '../../../errors/AppError';

export const chatBotController = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const { prompt } = req.body;

    const messages: IMessage[] = [];

    // check prompt
    if (prompt) {
      messages.push({
        role: 'user',
        content: prompt,
      });
    }

    // initialized chatbot class
    const chatBotTools = new ChatbotBuilder(prompt, {
      name: user.name,
      email: user.email,
    });

    // add actions
    chatBotTools.addAction(
      INTENTS.PRODUCT_LIST,
      {
        title: 'Product LIST',
        description: '...',

        inputSchema: z.object({
          prompt: z.string(),
        }),

        outputSchema: z.any(),
      },

      async ({ prompt }) => {
        const result = await productListHandler(prompt);
        return result;
      },
    );

     chatBotTools.addAction(
      INTENTS.PRODUCT_DETAILS,
      {
        title: 'Product Details Query',
        description: '...',

        inputSchema: z.object({
          prompt: z.string(),
        }),

        outputSchema: z.any(),
      },

      async ({ prompt }) => {
        const result = await productDetailsHandler(prompt);
        return result;
      },
    );

    chatBotTools.addAction(
      INTENTS.ORDER_LIST,
      {
        title: 'List user order from db',
        description: '...',

        inputSchema: z.object({
          email: z.string(),
        }),

        outputSchema: z.any(),
      },
      async ({email }) => {
        const result = await getOrderListHandler(email);
        return result;
      },
    );

    chatBotTools.addAction(
      INTENTS.TRACK_ORDER,
      {
        title: 'Tracking order',
        description: '...',

        inputSchema: z.object({
          email: z.string(),
          orderId: z.string().nullable().optional(),
        }),

        outputSchema: z.any(),
      },
      async ({ orderId, email }) => {
        const result = await trackOrderHandler({
          email: email,
          orderId: orderId as string
        });
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
        }),

        outputSchema: z.any(),
      },
      async ({ orderId, email }) => {
        const result = await cancelOrderHandler({
          email: email,
          orderId: orderId as string,
        });
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
        }),

        outputSchema: z.any(),
      },

      async ({ prompt }) => {
        const result = await generalQuestionHandler({ prompt });
        return result;
      },
    );

    // get tool Response
    const actionResult = await chatBotTools.run();

    // finally make a response from chatbot
    const response = actionResult.map((action) => action.result).join('\n\n');

    // push assistent message
    messages.push({
        role: 'assistant',
        content: response as string,
      });

    // push message into the DB

    await Inbox.findOneAndUpdate(
      { owner: user._id },
      {
        $push: {
          messages: {
            $each: messages,
          },
        },
      },
      {
        new: true,
        upsert: true,
      },
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      data: response,
    });
  },
);

export const getChatMessageFromDB = catchAsync(
  async (req: Request, res: Response) => {
    const { _id } = req.user;
    if (!_id) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'email not found!');
    }

    let message: IMessage[] = [];

    const inbox = await Inbox.findOne({ owner: _id });

    if (inbox?.messages) {
      message = inbox.messages;
    }

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      data: message,
    });
  },
);
