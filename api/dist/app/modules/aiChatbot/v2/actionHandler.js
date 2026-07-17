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
exports.generalQuestionHandler = exports.cancelOrderHandler = exports.getOrderHandler = exports.productDetailsHandler = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const product_service_1 = require("../../product/product.service");
const chat_utils_1 = require("../chat.utils");
const brand_service_1 = require("../../brand/brand.service");
const category_service_1 = require("../../category/category.service");
const order_model_1 = require("../../order/order.model");
const embedding_1 = __importDefault(require("../../../config/embedding"));
const quadrant_1 = __importDefault(require("../../../config/quadrant"));
const productDetailsHandler = (prompt) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(prompt === null || prompt === void 0 ? void 0 : prompt.trim())) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Prompt is required');
    }
    // Get all brands & categories
    const [brands, categories] = yield Promise.all([
        (0, brand_service_1.getAllBrandFromDBService)({}),
        (0, category_service_1.getAllCategoryFromDBService)({}),
    ]);
    const queryOptions = {};
    // Brand extraction
    queryOptions.brand = (0, chat_utils_1.extractIds)(prompt, brands.data);
    // Category extraction
    queryOptions.category = (0, chat_utils_1.extractIds)(prompt, categories.data);
    // Price extraction
    const priceText = prompt.toLowerCase();
    let minPrice = 0;
    let maxPrice = 100000;
    // under / below
    const maxMatch = priceText.match(/(under|below|less than|<=)\s*(\d+)(k|thousand)?/);
    if (maxMatch) {
        maxPrice = Number(maxMatch[2]) * (maxMatch[3] ? 1000 : 1);
    }
    // above / more than
    const minMatch = priceText.match(/(above|more than|greater than|>=)\s*(\d+)(k|thousand)?/);
    if (minMatch) {
        minPrice = Number(minMatch[2]) * (minMatch[3] ? 1000 : 1);
    }
    // range
    const rangeMatch = priceText.match(/(\d+)(k|thousand)?\s*(to|-)\s*(\d+)(k|thousand)?/);
    if (rangeMatch) {
        minPrice = Number(rangeMatch[1]) * (rangeMatch[2] ? 1000 : 1);
        maxPrice = Number(rangeMatch[4]) * (rangeMatch[5] ? 1000 : 1);
    }
    queryOptions.minPrice = minPrice;
    queryOptions.maxPrice = maxPrice;
    // Search term extraction
    const brandIds = queryOptions.brand.split(',');
    const categoryIds = queryOptions.category.split(',');
    const brandNames = brands.data
        .filter((b) => brandIds.includes(b._id.toString()))
        .map((b) => b.name);
    const categoryNames = categories.data
        .filter((c) => categoryIds.includes(c._id.toString()))
        .map((c) => c.name);
    const searchTerm = (0, chat_utils_1.extractSearchTerm)(prompt, [
        ...brandNames,
        ...categoryNames,
    ]);
    // Search product
    const products = yield (0, product_service_1.atlasProductSearchService)(searchTerm, queryOptions);
    const queryProducts = products.data.filter((product) => (product === null || product === void 0 ? void 0 : product.isDeleted) !== true && (product === null || product === void 0 ? void 0 : product.isPublished) !== false);
    if (!queryProducts.length) {
        return {
            error: {
                code: 'PRODUCT_NOT_FOUND',
                message: 'Product not found',
            },
        };
    }
    return (0, chat_utils_1.normalizeProduct)(queryProducts);
});
exports.productDetailsHandler = productDetailsHandler;
const getOrderHandler = (email, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    let order;
    if (orderId) {
        order = yield order_model_1.Order.findOne({
            orderId,
            'shippingInfo.email': email,
        }).populate('items.product');
    }
    else {
        order = yield order_model_1.Order.find({
            'shippingInfo.email': email,
        })
            .populate('items.product')
            .sort({ createdAt: -1 });
    }
    if (!order || (Array.isArray(order) && order.length === 0)) {
        return {
            error: {
                code: 'ORDER_NOT_FOUND',
                message: 'Order not found.',
            },
        };
    }
    const result = Array.isArray(order)
        ? order.map(chat_utils_1.normalizeOrder)
        : (0, chat_utils_1.normalizeOrder)(order);
    return result;
});
exports.getOrderHandler = getOrderHandler;
const cancelOrderHandler = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, orderId, }) {
    if (!orderId) {
        return {
            error: {
                code: 'ORDER_ID_REQUIRED',
                message: 'Please provide your order ID.',
            },
        };
    }
    const order = yield order_model_1.Order.findOne({
        orderId,
        'shippingInfo.email': email,
    });
    if (!order) {
        return {
            error: {
                code: 'ORDER_NOT_FOUND',
                message: 'Order not found.',
            },
        };
    }
    if (order.isCancel) {
        return {
            error: {
                code: 'ORDER_ALREADY_CANCELLED',
                message: 'This order has already been cancelled.',
            },
        };
    }
    // prevent cancel after shipping
    if (['shipped', 'delivered'].includes(order.status)) {
        return {
            error: {
                code: 'CANNOT_CANCEL_ORDER',
                message: 'Cannot cancel after order is shipped or delivered',
                errorData: (0, chat_utils_1.normalizeOrder)(order),
            },
        };
    }
    const result = yield order_model_1.Order.findByIdAndUpdate(orderId, { isCancel: true, status: 'pending' }, { new: true });
    return {
        message: 'Order canceled.',
        data: (0, chat_utils_1.normalizeOrder)(result),
    };
});
exports.cancelOrderHandler = cancelOrderHandler;
const generalQuestionHandler = (_a) => __awaiter(void 0, [_a], void 0, function* ({ prompt, }) {
    if (!prompt) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Prompt not found!');
    }
    // prompt embedding
    const vectorPrompt = yield (0, embedding_1.default)(prompt);
    if (!Array.isArray(vectorPrompt) || typeof vectorPrompt[0] !== 'number') {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Formate mismatch!');
    }
    const COLLECTION_NAME = 'general_qa';
    // serach for similar QA
    const result = yield quadrant_1.default.query(COLLECTION_NAME, {
        query: vectorPrompt,
        with_payload: true,
        limit: 2,
    });
    if (result.points.length === 0) {
        return {
            error: {
                code: 'CONTENT_NOT_FOUND!',
                message: 'Please provide a valid context.',
            },
        };
    }
    // normalize result
    const normalizedResult = result.points.map((point) => {
        var _a, _b, _c;
        return {
            title: (_a = point.payload) === null || _a === void 0 ? void 0 : _a.title,
            description: (_b = point.payload) === null || _b === void 0 ? void 0 : _b.description,
            content: (_c = point.payload) === null || _c === void 0 ? void 0 : _c.content,
        };
    });
    // Print result
    return normalizedResult;
});
exports.generalQuestionHandler = generalQuestionHandler;
