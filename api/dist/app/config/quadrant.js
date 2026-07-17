"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const js_client_rest_1 = require("@qdrant/js-client-rest");
const _1 = __importDefault(require("."));
const qdrantClient = new js_client_rest_1.QdrantClient({
    url: _1.default.QDRANT_ENDPOINT,
    apiKey: _1.default.QDRANT_API_KEY,
});
exports.default = qdrantClient;
