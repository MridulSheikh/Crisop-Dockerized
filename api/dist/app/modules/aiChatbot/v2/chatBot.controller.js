"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatMessageFromDB = exports.chatBotController = void 0;
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const ChatBotBuilder_1 = require("../../../builder/ChatBotBuilder");
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const zod_1 = __importDefault(require("zod"));
const actionHandler_1 = require("./actionHandler");
const inbox_model_1 = __importDefault(require("./inbox.model"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
exports.chatBotController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { prompt } = req.body;
    const messages = [];
    // check prompt
    if (prompt) {
        messages.push({
            role: 'user',
            content: prompt,
        });
    }
    // initialized chatbot class
    const chatBotTools = new ChatBotBuilder_1.ChatbotBuilder(prompt, {
        name: user.name,
        email: user.email,
    });
    // add actions
    chatBotTools.addAction(ChatBotBuilder_1.INTENTS.PRODUCT_LIST, {
        title: 'Product LIST',
        description: '...',
        inputSchema: zod_1.default.object({
            prompt: zod_1.default.string(),
        }),
        outputSchema: zod_1.default.any(),
    }, (_a) => __awaiter(void 0, [_a], void 0, function* ({ prompt }) {
        const result = yield (0, actionHandler_1.productListHandler)(prompt);
        return result;
    }));
    chatBotTools.addAction(ChatBotBuilder_1.INTENTS.PRODUCT_DETAILS, {
        title: 'Product Details Query',
        description: '...',
        inputSchema: zod_1.default.object({
            prompt: zod_1.default.string(),
        }),
        outputSchema: zod_1.default.any(),
    }, (_a) => __awaiter(void 0, [_a], void 0, function* ({ prompt }) {
        const result = yield (0, actionHandler_1.productDetailsHandler)(prompt);
        return result;
    }));
    chatBotTools.addAction(ChatBotBuilder_1.INTENTS.ORDER_LIST, {
        title: 'List user order from db',
        description: '...',
        inputSchema: zod_1.default.object({
            email: zod_1.default.string(),
        }),
        outputSchema: zod_1.default.any(),
    }, (_a) => __awaiter(void 0, [_a], void 0, function* ({ email }) {
        const result = yield (0, actionHandler_1.getOrderListHandler)(email);
        return result;
    }));
    chatBotTools.addAction(ChatBotBuilder_1.INTENTS.TRACK_ORDER, {
        title: 'Tracking order',
        description: '...',
        inputSchema: zod_1.default.object({
            email: zod_1.default.string(),
            orderId: zod_1.default.string().nullable().optional(),
        }),
        outputSchema: zod_1.default.any(),
    }, (_a) => __awaiter(void 0, [_a], void 0, function* ({ orderId, email }) {
        const result = yield (0, actionHandler_1.trackOrderHandler)({
            email: email,
            orderId: orderId
        });
        return result;
    }));
    chatBotTools.addAction(ChatBotBuilder_1.INTENTS.CANCEL_ORDER, {
        title: 'Perform order canceling',
        description: '...',
        inputSchema: zod_1.default.object({
            email: zod_1.default.string(),
            orderId: zod_1.default.string().nullable().optional(),
        }),
        outputSchema: zod_1.default.any(),
    }, (_a) => __awaiter(void 0, [_a], void 0, function* ({ orderId, email }) {
        const result = yield (0, actionHandler_1.cancelOrderHandler)({
            email: email,
            orderId: orderId,
        });
        return result;
    }));
    chatBotTools.addAction(ChatBotBuilder_1.INTENTS.GENERAL_QA, {
        title: 'general QA',
        description: '...',
        inputSchema: zod_1.default.object({
            prompt: zod_1.default.string(),
        }),
        outputSchema: zod_1.default.any(),
    }, (_a) => __awaiter(void 0, [_a], void 0, function* ({ prompt }) {
        const result = yield (0, actionHandler_1.generalQuestionHandler)({ prompt });
        return result;
    }));
    // get tool Response
    const actionResult = yield chatBotTools.run();
    // finally make a response from chatbot
    const response = actionResult.map((action) => action.result).join('\n\n');
    // push assistent message
    messages.push({
        role: 'assistant',
        content: response,
    });
    // push message into the DB
    yield inbox_model_1.default.findOneAndUpdate({ owner: user._id }, {
        $push: {
            messages: {
                $each: messages,
            },
        },
    }, {
        new: true,
        upsert: true,
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: response,
    });
}));
exports.getChatMessageFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    if (!_id) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'email not found!');
    }
    let message = [];
    const inbox = yield inbox_model_1.default.findOne({ owner: _id });
    if (inbox === null || inbox === void 0 ? void 0 : inbox.messages) {
        message = inbox.messages;
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        data: message,
    });
}));
