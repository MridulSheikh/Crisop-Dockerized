"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_interface_1 = require("../user/user.interface");
const aiChatFirewall_1 = require("../../middlewares/aiChatFirewall");
const embedding_controller_1 = require("./v2/embedding.controller");
const chatBot_controller_1 = require("./v2/chatBot.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const prompt_validation_1 = require("./v2/prompt.validation");
const router = express_1.default.Router();
router.route('/v2')
    .post((0, auth_1.default)(user_interface_1.UserRole.admin, user_interface_1.UserRole.super, user_interface_1.UserRole.manager, user_interface_1.UserRole.user), (0, validateRequest_1.default)(prompt_validation_1.promptValidationSchema), (0, aiChatFirewall_1.aiChatFirewall)(), chatBot_controller_1.chatBotController)
    .get((0, auth_1.default)(user_interface_1.UserRole.admin, user_interface_1.UserRole.super, user_interface_1.UserRole.manager, user_interface_1.UserRole.user), chatBot_controller_1.getChatMessageFromDB);
router.route('/add-knowledge')
    .post((0, auth_1.default)(user_interface_1.UserRole.admin, user_interface_1.UserRole.super), embedding_controller_1.addKnowladgeController);
router.route("/knowledge")
    .get();
exports.default = router;
