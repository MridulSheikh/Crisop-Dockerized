"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
const _1 = __importDefault(require("."));
dotenv_1.default.config();
const redisClient = (0, redis_1.createClient)({
    url: _1.default.REDIS_CONNECTION,
});
redisClient.on('connect', () => {
    console.log('✅ Redis Connected');
});
redisClient.on('ready', () => {
    console.log('🚀 Redis Ready');
});
redisClient.on('reconnecting', () => {
    console.log('🔄 Redis Reconnecting...');
});
redisClient.on('error', (err) => {
    console.error('❌ Redis Error:', err);
});
exports.default = redisClient;
