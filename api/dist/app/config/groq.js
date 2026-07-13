"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.groqAiModel = exports.groq = void 0;
const index_js_1 = __importDefault(require("groq-sdk/index.js"));
const _1 = __importDefault(require("."));
exports.groq = new index_js_1.default({
    apiKey: _1.default.GROQ_API_KEY
});
exports.groqAiModel = "llama-3.3-70b-versatile";
