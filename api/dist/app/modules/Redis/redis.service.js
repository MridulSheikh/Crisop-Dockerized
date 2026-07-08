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
exports.RedisService = void 0;
const RedisClient_1 = __importDefault(require("../../config/RedisClient"));
const set = (key, value, expireInSeconds) => __awaiter(void 0, void 0, void 0, function* () {
    if (expireInSeconds) {
        return RedisClient_1.default.set(key, value, {
            EX: expireInSeconds,
        });
    }
    return RedisClient_1.default.set(key, value);
});
const get = (key) => __awaiter(void 0, void 0, void 0, function* () {
    return RedisClient_1.default.get(key);
});
const del = (key) => __awaiter(void 0, void 0, void 0, function* () {
    return RedisClient_1.default.del(key);
});
exports.RedisService = {
    set,
    get,
    del,
};
