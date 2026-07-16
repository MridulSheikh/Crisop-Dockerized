import express from 'express';
import { chatbotController } from './v1/chat.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.interface';
import { aiChatFirewall } from '../../middlewares/aiChatFirewall';
import chatBotController from './v2/chatBot.controller';
import { addKnowladgeController } from './v2/embedding.controller';
const router = express.Router();

router.route("/")
.post(auth(UserRole.admin, UserRole.super, UserRole.manager, UserRole.user), aiChatFirewall(),chatbotController)

router.route('/v2')
.post(auth(UserRole.admin, UserRole.super, UserRole.manager, UserRole.user), aiChatFirewall(),chatBotController)

router.route('/add-knowledge')
.post(auth(UserRole.admin, UserRole.super),addKnowladgeController)

router.route("/knowledge")
.get()

export default router;