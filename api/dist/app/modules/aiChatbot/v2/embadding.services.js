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
exports.addKnowladgeServices = exports.COLLECTION_NAME = void 0;
const embedding_1 = __importDefault(require("../../../config/embedding"));
const quadrant_1 = __importDefault(require("../../../config/quadrant"));
const crypto_1 = require("crypto");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
exports.COLLECTION_NAME = 'general_qa';
const addKnowladgeServices = (content, title, description) => __awaiter(void 0, void 0, void 0, function* () {
    const collections = yield quadrant_1.default.getCollections();
    const exists = collections.collections.some((collection) => collection.name === exports.COLLECTION_NAME);
    if (!exists) {
        yield quadrant_1.default.createCollection(exports.COLLECTION_NAME, {
            vectors: {
                size: 1024,
                distance: 'Cosine',
            },
        });
    }
    const vector = yield (0, embedding_1.default)(content);
    if (!Array.isArray(vector) || typeof vector[0] !== 'number') {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Formate mismatch!');
    }
    const result = yield quadrant_1.default.upsert('general_qa', {
        wait: true,
        points: [
            {
                id: (0, crypto_1.randomUUID)(),
                vector: vector,
                payload: {
                    title,
                    description,
                    content
                },
            },
        ],
    });
    if (result.status !== 'completed') {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Knowledge not inserted!');
    }
    return result;
});
exports.addKnowladgeServices = addKnowladgeServices;
