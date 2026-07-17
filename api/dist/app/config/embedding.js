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
const inference_1 = require("@huggingface/inference");
const _1 = __importDefault(require("."));
const hf = new inference_1.InferenceClient(_1.default.HF_TOKEN);
const embedding = (input) => __awaiter(void 0, void 0, void 0, function* () {
    return yield hf.featureExtraction({
        model: "BAAI/bge-m3",
        inputs: input,
    });
});
exports.default = embedding;
