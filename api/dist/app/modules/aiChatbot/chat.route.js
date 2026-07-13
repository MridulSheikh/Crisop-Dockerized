"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chat_controller_1 = require("./chat.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_interface_1 = require("../user/user.interface");
const aiChatFirewall_1 = require("../../middlewares/aiChatFirewall");
const router = express_1.default.Router();
router.route("/")
    .post((0, auth_1.default)(user_interface_1.UserRole.admin, user_interface_1.UserRole.super, user_interface_1.UserRole.manager, user_interface_1.UserRole.user), (0, aiChatFirewall_1.aiChatFirewall)(), chat_controller_1.chatbotController);
exports.default = router;
