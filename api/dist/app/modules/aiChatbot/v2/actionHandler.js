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
exports.generalQuestionHandler = exports.cancelOrderHandler = exports.trackOrderHandler = exports.getOrderListHandler = exports.productDetailsHandler = exports.productListHandler = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const product_service_1 = require("../../product/product.service");
const chat_utils_1 = require("../chat.utils");
const brand_service_1 = require("../../brand/brand.service");
const category_service_1 = require("../../category/category.service");
const order_model_1 = require("../../order/order.model");
const embedding_1 = __importDefault(require("../../../config/embedding"));
const quadrant_1 = __importDefault(require("../../../config/quadrant"));
const config_1 = __importDefault(require("../../../config"));
const groq_1 = require("../../../config/groq");
const productListHandler = (prompt) => __awaiter(void 0, void 0, void 0, function* () {
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
        return `
# Product Search Results

I couldn't find any products matching your request at the moment.

You can try:
- Searching with a different product name.
- Browsing another category or brand.
- Checking back later, as new products may be added.
`;
    }
    const brandText = (brandNames === null || brandNames === void 0 ? void 0 : brandNames.length) > 0 ? brandNames.join(', ') : '';
    const categoryText = (categoryNames === null || categoryNames === void 0 ? void 0 : categoryNames.length) > 0 ? categoryNames.join(', ') : '';
    const title = `# Browse Our ${brandText ? `${brandText} ` : ''}${categoryText} Products`;
    const content = `

  ${title}

${queryProducts
        .map((product) => {
        var _a;
        return `- [${product.name}](${config_1.default.CLIENT_URL}/shop/${product._id}) — $${(_a = product.discountPrice) !== null && _a !== void 0 ? _a : product.price}`;
    })
        .join('\n')}
`;
    return content;
});
exports.productListHandler = productListHandler;
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
        return `
# Product Search Results

I couldn't find any products matching your request at the moment.

You can try:
- Searching with a different product name.
- Browsing another category or brand.
- Checking back later, as new products may be added.
`;
    }
    // normalize product
    const normalizedProducts = (0, chat_utils_1.normalizeProduct)(queryProducts);
    const aiPrompt = Array.isArray(normalizedProducts)
        ? normalizedProducts[0]
        : normalizedProducts;
    const systemPrompt = `
You are Crisop's AI shopping assistant.

Convert the provided product data into a short, natural, and customer-friendly response.

Rules:
- Use only the provided product data.
- Never invent or assume information.
- If no products are found, politely say so and suggest trying different keywords.
- Ignore internal fields (_id, __v, IDs, image URLs, timestamps, etc.).
- Never mention unpublished or deleted status.
- Format prices using the USD symbol ($).
- For each product, mention only:
  • Product name
  • Price
  • One short sentence describing its key features or use.
- If multiple products exist, list them with bullet points.
- Keep the entire response under 120 words.
- Avoid repeating information.
- Do not use markdown tables, JSON, or code blocks.
- End with a short offer to help if appropriate.

Product Data:
${JSON.stringify(aiPrompt)}
`;
    const response = yield groq_1.groq.chat.completions.create({
        model: groq_1.groqAiModel,
        messages: [
            {
                role: 'assistant',
                content: systemPrompt,
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
        temperature: 0,
    });
    return response.choices[0].message.content;
});
exports.productDetailsHandler = productDetailsHandler;
const getOrderListHandler = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_model_1.Order.find({
        'shippingInfo.email': email,
    })
        .populate('items.product')
        .sort({ createdAt: -1 });
    if (!orders || (Array.isArray(orders) && orders.length === 0)) {
        return "I couldn't find any orders associated with your account yet. If you've recently placed an order, it may take a few moments to appear. Otherwise, you can start shopping and place your first order anytime.";
    }
    const response = orders
        .map((order) => {
        const orderStatus = order.isCancel
            ? 'Cancelled'
            : order.status.charAt(0).toUpperCase() + order.status.slice(1);
        return `- **${order.orderId}**
  - Status: ${orderStatus}
  - Ordered on: ${new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })}`;
    })
        .join('\n\n');
    return `I found ${orders.length} order${orders.length > 1 ? 's' : ''} associated with your account.

${response}

Let me know if you'd like more details about any specific order.`;
});
exports.getOrderListHandler = getOrderListHandler;
const trackOrderHandler = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, orderId, }) {
    if (!orderId) {
        return "Sure! I can help you track your order. Please send me your Order ID (e.g., ORD-XXXXXXXX), and I'll check its latest status for you.";
    }
    const order = yield order_model_1.Order.findOne({
        orderId,
        "shippingInfo.email": email,
    }).populate("items.product");
    if (!order) {
        return "I couldn't find any order with that Order ID. Please double-check the Order ID and try again. If the problem continues, feel free to contact our customer support.";
    }
    const paymentMethod = order.isCod
        ? "Cash on Delivery"
        : "Online Payment";
    const paymentStatus = order.isPaymentComplete
        ? "Paid"
        : "Payment Pending";
    const orderStatus = order.isCancel
        ? "Cancelled"
        : order.status.charAt(0).toUpperCase() + order.status.slice(1);
    const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    return `# Order Details

- **Order ID:** ${order.orderId}
- **Status:** ${orderStatus}
- **Payment:** ${paymentMethod} (${paymentStatus})
- **Total:** $${order.total}
- **Ordered On:** ${orderDate}

> ${order.isCancel
        ? "This order has been cancelled."
        : order.status === "delivered"
            ? "Your order has been successfully delivered."
            : order.status === "shipped"
                ? "Your order has been shipped and is on its way."
                : "Your order is currently being processed."}

If you need any further assistance, feel free to ask.`;
});
exports.trackOrderHandler = trackOrderHandler;
const cancelOrderHandler = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, orderId, }) {
    if (!orderId) {
        return 'Please provide your Order ID to cancel your order.';
    }
    const order = yield order_model_1.Order.findOne({
        orderId,
        'shippingInfo.email': email,
    });
    if (!order) {
        return "I couldn't find any order matching the provided Order ID.";
    }
    if (order.isCancel) {
        return 'This order has already been cancelled.';
    }
    if (['shipped', 'delivered'].includes(order.status)) {
        return 'Sorry, this order can no longer be cancelled because it has already been shipped or delivered.';
    }
    order.isCancel = true;
    yield order.save();
    return `Your order (${order.orderId}) has been cancelled successfully.`;
});
exports.cancelOrderHandler = cancelOrderHandler;
const generalQuestionHandler = (_a) => __awaiter(void 0, [_a], void 0, function* ({ prompt, }) {
    if (!prompt) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Prompt not found!');
    }
    // Create embedding
    const vectorPrompt = yield (0, embedding_1.default)(prompt);
    if (!Array.isArray(vectorPrompt) || typeof vectorPrompt[0] !== 'number') {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Format mismatch!');
    }
    const COLLECTION_NAME = 'general_qa';
    // Search Qdrant
    const result = yield quadrant_1.default.query(COLLECTION_NAME, {
        query: vectorPrompt,
        with_payload: true,
        limit: 5,
    });
    if (result.points.length === 0) {
        return "I'm sorry, but I couldn't find any information related to your question.";
    }
    const context = result.points
        .map((point) => {
        var _a, _b, _c;
        return `
Title: ${(_a = point.payload) === null || _a === void 0 ? void 0 : _a.title}
Description: ${(_b = point.payload) === null || _b === void 0 ? void 0 : _b.description}
Content: ${(_c = point.payload) === null || _c === void 0 ? void 0 : _c.content}
`;
    })
        .join('\n\n');
    const completion = yield groq_1.groq.chat.completions.create({
        model: groq_1.groqAiModel,
        temperature: 0,
        messages: [
            {
                role: 'assistant',
                content: `
You are Crisop's AI customer support assistant.

Answer the user's question using ONLY the provided context.

Rules:
- Never invent information.
- If the answer isn't in the context, politely say you don't have that information.
- Keep the answer short (under 100 words).
- Use a friendly, professional tone.
- Don't mention "context" or "database".
`,
            },
            {
                role: 'user',
                content: `Question:
${prompt}

Information:
${context}`,
            },
        ],
    });
    return completion.choices[0].message.content;
});
exports.generalQuestionHandler = generalQuestionHandler;
