import { TIntent } from './../../../builder/ChatBotBuilder';
import httpStatus from 'http-status';
import AppError from '../../../errors/AppError';
import { TSearchOptions } from '../../product/product.interface';
import { atlasProductSearchService } from '../../product/product.service';
import {
  extractIds,
  extractSearchTerm,
  normalizeOrder,
  normalizeProduct,
} from '../chat.utils';
import { getAllBrandFromDBService } from '../../brand/brand.service';
import { getAllCategoryFromDBService } from '../../category/category.service';
import { Order } from '../../order/order.model';
import embedding from '../../../config/embedding';
import qdrantClient from '../../../config/quadrant';

type TQueryOptions = {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
};

export const productDetailsHandler = async (
  prompt: string,
  intent: TIntent,
) => {
  if (!prompt?.trim()) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Prompt is required');
  }

  // Get all brands & categories
  const [brands, categories] = await Promise.all([
    getAllBrandFromDBService({}),
    getAllCategoryFromDBService({}),
  ]);

  const queryOptions: TQueryOptions = {};

  // Brand extraction
  queryOptions.brand = extractIds(prompt, brands.data);

  // Category extraction
  queryOptions.category = extractIds(prompt, categories.data);

  // Price extraction
  const priceText = prompt.toLowerCase();

  let minPrice = 0;
  let maxPrice = 100000;

  // under / below
  const maxMatch = priceText.match(
    /(under|below|less than|<=)\s*(\d+)(k|thousand)?/,
  );

  if (maxMatch) {
    maxPrice = Number(maxMatch[2]) * (maxMatch[3] ? 1000 : 1);
  }

  // above / more than
  const minMatch = priceText.match(
    /(above|more than|greater than|>=)\s*(\d+)(k|thousand)?/,
  );

  if (minMatch) {
    minPrice = Number(minMatch[2]) * (minMatch[3] ? 1000 : 1);
  }

  // range
  const rangeMatch = priceText.match(
    /(\d+)(k|thousand)?\s*(to|-)\s*(\d+)(k|thousand)?/,
  );

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

  const searchTerm = extractSearchTerm(prompt, [
    ...brandNames,
    ...categoryNames,
  ]);

  // Search product
  const products = await atlasProductSearchService(
    searchTerm,
    queryOptions as TSearchOptions,
  );

  const queryProducts = products.data.filter(
    (product) => product?.isDeleted !== true && product?.isPublished !== false,
  );

  if (!queryProducts.length) {
    return {
      intentType: intent,
      error: {
        code: 'PRODUCT_NOT_FOUND',
        message: 'Product not found',
      },
    };
  }

  return {
    intentType: intent,
    data: normalizeProduct(queryProducts),
  };
};

export const getOrderHandler = async (
  email: string,
  intent: TIntent,
  orderId?: string,
) => {
  let order;

  if (orderId) {
    order = await Order.findOne({
      orderId,
      'shippingInfo.email': email,
    }).populate('items.product');
  } else {
    order = await Order.find({
      'shippingInfo.email': email,
    })
      .populate('items.product')
      .sort({ createdAt: -1 });
  }

  if (!order || (Array.isArray(order) && order.length === 0)) {
    return {
      intentType: intent,
      data: null,
      error: {
        code: 'ORDER_NOT_FOUND',
        message: 'Order not found.',
      },
    };
  }

  return {
    intentType: intent,
    data: Array.isArray(order)
      ? order.map(normalizeOrder)
      : normalizeOrder(order),
  };
};

export const cancelOrderHandler = async ({
  email,
  intent,
  orderId,
}: {
  email: string;
  intent: TIntent;
  orderId?: string;
}) => {
  if (!orderId) {
    return {
      intentType: intent,
      data: null,
      error: {
        code: 'ORDER_ID_REQUIRED',
        message: 'Please provide your order ID.',
      },
    };
  }

  const order = await Order.findOne({
    orderId,
    'shippingInfo.email': email,
  });

  if (!order) {
    return {
      intentType: intent,
      data: null,
      error: {
        code: 'ORDER_NOT_FOUND',
        message: 'Order not found.',
      },
    };
  }

  if (order.isCancel) {
    return {
      intentType: intent,
      data: normalizeOrder(order),
      error: {
        code: 'ORDER_ALREADY_CANCELLED',
        message: 'This order has already been cancelled.',
      },
    };
  }

  // prevent cancel after shipping
  if (['shipped', 'delivered'].includes(order.status)) {
    return {
      intentType: intent,
      data: normalizeOrder(order),
      error: {
        code: 'CANNOT_CANCEL_ORDER',
        message: 'Cannot cancel after order is shipped or delivered',
      },
    };
  }

  const result = await Order.findByIdAndUpdate(
    orderId,
    { isCancel: true, status: 'pending' },
    { new: true },
  );

  return {
    intentType: intent,
    canceled: true,
    data: normalizeOrder(result),
  };
};

export const generalQuestionHandler = async ({
  prompt,
  intent,
}: {
  prompt: string;
  intent: TIntent;
}) => {
  if (!prompt) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Prompt not found!');
  }
  if (!intent) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Intent not found!');
  }

  // prompt embedding
  const vectorPrompt = await embedding(prompt);

  if (!Array.isArray(vectorPrompt) || typeof vectorPrompt[0] !== 'number') {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Formate mismatch!');
  }
  const COLLECTION_NAME = 'general_qa';

  // serach for similar QA
  const result = await qdrantClient.query(COLLECTION_NAME, {
    query: vectorPrompt as number[],
    with_payload: true,
    limit: 2,
  });

  if(result.points.length === 0){
    return {
      intentType: intent,
      error: {
        code: 'CONTENT_NOT_FOUND!',
        message: 'Please provide a valid context.',
      },
    }
  }

  // normalize result
  const normalizedResult = result.points.map((point) => {
    return {
      title: point.payload?.title,
      description: point.payload?.description,
      content: point.payload?.content,
    };
  });
  
  // Print result
  return {
    intentType: intent,
    data: normalizedResult,
  }
};
