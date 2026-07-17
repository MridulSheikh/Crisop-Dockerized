import httpStatus from 'http-status';
import AppError from '../../../errors/AppError';
import User from '../../user/user.model';
import {
  GenerateContext,
  intentRouter,
  
} from './intentRouter/intentRouter.services';
import Inbox from './chat.model';

const chatBotService = async (
  message: string,
  user: {
    email: string;
    name: string;
  },
  inboxId?: string,
) => {
  // chek inbox id
  const inbox = await Inbox.findById(inboxId);

  if (!inbox) {
    // check if user exist or not
    const isUserExists = await User.isUserExsitsByUserEmail(user.email);

    if (!isUserExists) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Please provide a valid user email',
      );
    }

    
  }

  const jobs = await GenerateContext(message);

  const result = await intentRouter(jobs, message, user.email);

  return result;
};

export const chatService = { chatBotService };
