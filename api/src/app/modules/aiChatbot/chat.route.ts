import express from 'express';
import { chatbotController } from './chat.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.interface';
import { aiChatFirewall } from '../../middlewares/aiChatFirewall';
const router = express.Router();

router.route("/")
.post(auth(UserRole.admin, UserRole.super, UserRole.manager, UserRole.user), aiChatFirewall(),chatbotController)

export default router;