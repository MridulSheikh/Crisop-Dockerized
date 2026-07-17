import { Request, Response } from 'express';
import catchAsync from '../../../utils/catchAsync';

import sendResponse from '../../../utils/sendResponse';
import httpStatus from 'http-status';
import { chatService } from './chat.service';

export const chatbotController = catchAsync(async (req: Request, res: Response) => {
  const { message, inboxId } = req.body;
  const {email, name} = req.user;
  const result = await chatService.chatBotService(message, {email, name}, inboxId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Successfully generate response',
    data: result,
  });
});