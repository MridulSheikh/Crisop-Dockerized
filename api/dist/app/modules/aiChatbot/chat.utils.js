"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeProduct = exports.normalizeOrder = exports.formatProductsForAI = exports.extractSearchTerm = exports.extractIds = void 0;
const string_similarity_1 = __importDefault(require("string-similarity"));
const extractIds = (prompt, list) => {
    const words = prompt.toLowerCase().split(/\s+/);
    return list
        .filter((item) => {
        const brandName = item.name.toLowerCase();
        return words.some((word) => string_similarity_1.default.compareTwoStrings(word, brandName) > 0.7);
    })
        .map((item) => item._id.toString())
        .join(',');
};
exports.extractIds = extractIds;
const extractSearchTerm = (prompt, removeWords) => {
    let text = prompt.toLowerCase();
    // remove brand/category names
    removeWords.forEach((word) => {
        const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        text = text.replace(new RegExp(`\\b${escaped}\\b`, 'gi'), '');
    });
    // remove common phrases
    text = text.replace(/\b(do you have|i need|show me|give me|find me|i want|can you show)\b/gi, '');
    // remove filler words
    text = text.replace(/\b(i|need|some|show|me|want|give|find|available|and|with|the|a|an|for|please|brand)\b/gi, '');
    // remove extra spaces
    text = text.replace(/\s+/g, ' ').trim();
    // remove duplicate words
    const uniqueWords = [...new Set(text.split(' '))];
    return uniqueWords.join(' ');
};
exports.extractSearchTerm = extractSearchTerm;
const formatProductsForAI = (products) => {
    return products
        .map((product, index) => {
        var _a, _b;
        return `
Product ${index + 1}:

ID: ${product._id}

Name: ${product.name}

Category: ${((_a = product.category) === null || _a === void 0 ? void 0 : _a.name) || ""}

Price: ${product.discountPrice} $

Stock: ${product.stock ? "Available" : "Out of stock"}

Tags: ${((_b = product.tags) === null || _b === void 0 ? void 0 : _b.join(", ")) || ""}
`;
    })
        .join("\n-------------------\n");
};
exports.formatProductsForAI = formatProductsForAI;
// Data normization
const normalizeOrder = (order) => ({
    orderId: order.orderId,
    status: order.status,
    total: order.total,
    paymentStatus: order.isPaymentComplete ? "Paid" : "Pending",
    paymentMethod: order.isCod ? "Cash on Delivery" : "Online",
    isCancelled: order.isCancel,
    createdAt: order.createdAt,
    shipping: {
        address: order.shippingInfo.addressOneLine,
        division: order.shippingInfo.division,
        contact: order.shippingInfo.contact,
    },
    items: order.items.map((item) => {
        var _a, _b;
        return ({
            name: item.product.name,
            price: item.price,
            quantity: item.quantity,
            image: (_b = (_a = item.product.images) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.url,
        });
    }),
});
exports.normalizeOrder = normalizeOrder;
const normalizeProduct = (product) => {
    if (Array.isArray(product)) {
        return product.map(normalizeSingleProduct);
    }
    return normalizeSingleProduct(product);
};
exports.normalizeProduct = normalizeProduct;
const normalizeSingleProduct = (product) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return ({
        id: product._id,
        name: product.name,
        price: (_a = product.discountPrice) !== null && _a !== void 0 ? _a : product.price,
        regularPrice: product.price,
        category: (_c = (_b = product === null || product === void 0 ? void 0 : product.category) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : null,
        brand: (_e = (_d = product === null || product === void 0 ? void 0 : product.brand) === null || _d === void 0 ? void 0 : _d.name) !== null && _e !== void 0 ? _e : null,
        image: (_h = (_g = (_f = product.images) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.url) !== null && _h !== void 0 ? _h : null,
        inStock: product.isPublished && !product.isDeleted,
        tags: product.tags,
    });
};
