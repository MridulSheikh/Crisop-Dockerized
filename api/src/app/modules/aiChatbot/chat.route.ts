import express from 'express';
import { chatbotController } from './v1/chat.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.interface';
import { aiChatFirewall } from '../../middlewares/aiChatFirewall';
import chatBotController from './v2/chatBot.controller';
const router = express.Router();

router.route("/")
.post(auth(UserRole.admin, UserRole.super, UserRole.manager, UserRole.user), aiChatFirewall(),chatbotController)

router.route('/v2')
.post(auth(UserRole.admin, UserRole.super, UserRole.manager, UserRole.user), aiChatFirewall(),chatBotController)

export default router;