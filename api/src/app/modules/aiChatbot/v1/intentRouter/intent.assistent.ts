import httpStatus from 'http-status';
import AppError from '../../../../errors/AppError';
import { getAllBrandFromDBService } from '../../../brand/brand.service';
import { getAllCategoryFromDBService } from '../../../category/category.service';
import {
  extractIds,
  extractSearchTerm,
  formatProductsForAI,
} from '../../chat.utils';
import { atlasProductSearchService } from '../../../product/product.service';
import { TSearchOptions } from '../../../product/product.interface';
import { groq, groqAiModel } from '../../../../config/groq';
import { Order } from '../../../order/order.model';
import { canceledOrderServices } from '../../../order/order.service';

type TQueryOptions = {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
};

// export const productDetailsAssistent = async (prompt: string) => {
//   if (!prompt) {
//     throw new AppError(httpStatus.NOT_FOUND, 'prompt not found');
//   }

//   // context spliter
//   const userPrompts = await groq.chat.completions.create({
//     model: groqAiModel,
//     messages: [
//       {
//         role: 'system',
//         content: `
// You are a query context splitter.

// Task:
// - Split the user message into separate product search contexts.
// - If multiple products are mentioned with words like "and", "or", split them into independent contexts.
// - Correct obvious spelling mistakes and typing errors before splitting.
// - Normalize product names when possible.
// - Keep the original meaning unchanged.
// - Return ONLY JSON.
// - Do not add explanations, markdown, or extra text.

// Format:
// {
//  "contexts":[]
// }

// Example:

// Input:
// "I need chicken breast and Radhuni brand oil"

// Output:
// {
//  "contexts":[
//    "chicken breast",
//    "Radhuni brand oil"
//  ]
// }

// User Message:
// "${prompt}"
// `,
//       },
//       {
//         role: 'user',
//         content: prompt,
//       },
//     ],
//     temperature: 0,
//     max_tokens: 300,
//   });

//   const context = JSON.parse(
//     userPrompts.choices[0].message.content as string,
//   ).contexts;

//   // Brand finding
//   const brands = await getAllBrandFromDBService({});

//   // Category finding
//   const categories = await getAllCategoryFromDBService({});

//   // context maping
//   const queries = context.map((ctx: string) => {
//     const queryOptions: TQueryOptions = {};
//     queryOptions.brand = extractIds(ctx, brands.data);

//     queryOptions.category = extractIds(ctx, categories.data);

//     // Price extraction regex

//     const priceText = ctx.toLowerCase();

//     let minPrice = 0;
//     let maxPrice = 100000;

//     // under, below, less than 20000
//     const maxMatch = priceText.match(
//       /(under|below|less than|<=)\s*(\d+)(k|thousand)?/,
//     );

//     if (maxMatch) {
//       maxPrice = Number(maxMatch[2]) * (maxMatch[3] ? 1000 : 1);
//     }

//     // above, more than, greater than 50000
//     const minMatch = priceText.match(
//       /(above|more than|greater than|>=)\s*(\d+)(k|thousand)?/,
//     );

//     if (minMatch) {
//       minPrice = Number(minMatch[2]) * (minMatch[3] ? 1000 : 1);
//     }

//     // range: 1000 to 5000
//     const rangeMatch = priceText.match(
//       /(\d+)(k|thousand)?\s*(to|-)\s*(\d+)(k|thousand)?/,
//     );

//     if (rangeMatch) {
//       minPrice = Number(rangeMatch[1]) * (rangeMatch[2] ? 1000 : 1);

//       maxPrice = Number(rangeMatch[4]) * (rangeMatch[5] ? 1000 : 1);
//     }

//     queryOptions.minPrice = minPrice as number;
//     queryOptions.maxPrice = maxPrice as number;

//     // getSearch Terms
//     const brandIDs = queryOptions.brand.split(',');
//     const categroyIDs = queryOptions.category.split(',');

//     const brandNames = brands.data
//       .filter((b) => brandIDs.includes(b._id.toString()))
//       .map((b) => b.name);

//     const categoryNames = categories.data
//       .filter((c) => categroyIDs.includes(c._id.toString()))
//       .map((c) => c.name);

//     const searchTerm = extractSearchTerm(ctx, [
//       ...categoryNames,
//       ...brandNames,
//     ]);

//     return {
//       searchTerm,
//       queryOptions,
//     };
//   });

//   // retrive product form DB
//   const queryData = await Promise.all(
//     queries.map(
//       async (qr: { searchTerm: string; queryOptions: TSearchOptions }) => {
//         const products = await atlasProductSearchService(
//           qr.searchTerm,
//           qr.queryOptions as TSearchOptions,
//         );

//         return products.data;
//       },
//     ),
//   );

//   const querProducts = queryData
//     .flat()
//     .filter(
//       (product) =>
//         product?.isDeleted !== true && product?.isPublished !== false,
//     );

//   const productTextData = formatProductsForAI(querProducts);

//   const systemPrompt = `
// You are an e-commerce assistant.

// Rules:
// - Answer only from the provided product data.
// - Never invent product information.
// - Keep the response concise (maximum 2–3 lines).
// - Mention at most 3 matching products.
// - Include product name and price only.
// - If no product matches, reply: "Sorry, this product is currently unavailable."
// - use markdown headings, bullet lists.
// - Don't use product card
// - Respond naturally like a shopping assistant.

// Products:
// ${productTextData}

// User Query:
// ${prompt}
// `;

//   const botResponse = await groq.chat.completions.create({
//     model: groqAiModel,
//     messages: [
//       {
//         role: 'system',
//         content: systemPrompt,
//       },
//       {
//         role: 'user',
//         content: prompt,
//       },
//     ],
//     temperature: 0,
//   });

//   const response = botResponse.choices[0].message.content as string;

//   return {
//     intentType: 'PRODUCT_DETAILS',
//     data: querProducts,
//     message: response
//   };
// };
export const productDetailsAssistent = async (prompt: string) => {
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
      intentType: 'PRODUCT_DETAILS',
      data: queryProducts,
      message: 'Sorry, this product is currently unavailable.',
    };
  }

  // Format products for AI
  const productTextData = formatProductsForAI(queryProducts);

  const systemPrompt = `You are a professional e-commerce shopping assistant representing an online store.

Your goal is to help customers find products quickly and professionally.

Rules:
- Answer ONLY using the provided product data.
- Never invent or assume any product information.
- If products are found:
  - Briefly acknowledge the customer's request.
  - Recommend up to 3 of the most relevant products.
  - For each product include:
    - Product Name
    - Price
  - Present the response using Markdown headings and bullet lists.
  - Keep the response concise, friendly, and professional.
- If no matching product is found, reply exactly:
  "Sorry, this product is currently unavailable."
- Do not mention internal systems, databases, or provided data.
- Do not include IDs, stock information, discounts, or descriptions unless they are explicitly provided.
- Do not use tables.
- Keep the total response under 100 words.

Example:

### Recommended Products

Here are the best matches for your request:

- **Pomfret Fish (Rupchanda)** — ৳1750
- **Aar Fish** — ৳650
- **Bata Fish** — ৳375

Products:
${productTextData}`;

  const completion = await groq.chat.completions.create({
    model: groqAiModel,
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  return {
    intentType: 'PRODUCT_DETAILS',
    data: queryProducts,
    message: completion.choices[0].message.content,
  };
};
// order intent services
export const orderAssistent = async (prompt: string, userEmail: string) => {
  // check if prompt empty
  if (!prompt) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User Prompt not found');
  }
  // AI action extraction
  const actionFind = await groq.chat.completions.create({
    model: groqAiModel,
    messages: [
      {
        role: 'system',
        content: `You are an order assistant.

Extract user order action.

Available actions:
- TRACK_ORDER
- CANCEL_ORDER
- ORDER_DETAILS
- LIST_ORDER
- Return ONLY JSON.
- Do not add explanations, markdown, or extra text.

Format:
{
 "action":"",
 "orderId":""
}`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0,
  });

  const data = JSON.parse(actionFind.choices[0].message.content || '{}');

  // action route
  let order;

  if (data.orderId) {
    order = await Order.findOne({
      orderId: data.orderId,
      'shippingInfo.email': userEmail,
    }).populate('items.product');
  } else {
    // latest order

    order = await Order.findOne({
      'shippingInfo.email': userEmail,
    })
      .populate('items.product')
      .sort({
        createdAt: -1,
      });
  }

  if (!order) {
    return {
      intentType: 'ORDER_DETAILS',
      message: "I couldn't find your order. Please try again with Order ID",
    };
  }

  // action handle

  switch (data.action) {
    case 'CANCEL_ORDER': {
      const cancelled = await canceledOrderServices(order._id.toString());

      return {
        intentType: 'ORDER_DETAILS',

        action: data.action,

        message: `Your order ${order.orderId} has been cancelled.`,

        data: cancelled,
      };
    }

    case 'TRACK_ORDER':
      return {
        intentType: 'ORDER_DETAILS',

        action: data.action,

        message: `

## Order Status

**Order ID:** ${order.orderId}

**Status:** ${order.status}

**Payment:** ${order.isPaymentComplete ? 'Paid' : 'Pending'}

**Order Canceld:** ${order.isCancel ? 'YES' : 'NO'}

        `,
      };

    case 'LIST_ORDER': {
      const orders = await Order.find({
        'shippingInfo.email': userEmail,
      }).sort({
        createdAt: -1,
      });

      if (!orders.length) {
        return {
          intentType: 'ORDER_DETAILS',
          action: 'LIST_ORDER',
          message: 'No orders found for this customer.',
        };
      }

      const message = orders
        .map(
          (order, index) => `
### Order ${index + 1}

- **Order ID:** ${order.orderId}
- **Status:** ${order.status}
- **Total:** ৳${order.total}
- **Payment:** ${order.isPaymentComplete ? 'Completed' : 'Pending'}
- **Created:** ${new Date(order.createdAt).toLocaleDateString('en-GB')}
`,
        )
        .join('\n');
      return {
        intentType: 'ORDER_DETAILS',
        action: 'LIST_ORDER',
        message,
      };
    }

    default:
      return {
        intentType: 'ORDER_DETAILS',

        action: 'ORDER_DETAILS',

        message: `

## Order Details

**Order ID:** ${order.orderId}


Items:${order.items
          .map((item: any) => `- ${item.product.name} x ${item.quantity}`)
          .join('\n')}

Total:${order.total} $


**Status:** ${order.status}

**Payment:** ${order.isPaymentComplete ? 'Paid' : 'Pending'}

**Order Canceld:** ${order.isCancel ? 'YES' : 'NO'}

        `,
      };
  }
};

export const generalQuestion = async (prompt: string) => {
  if (!prompt) {
    throw new AppError(httpStatus.NOT_FOUND, 'prompt not found');
  }
  const botResponse = await groq.chat.completions.create({
    model: groqAiModel,
    messages: [
      {
        role: 'system',
        content: `You are an e-commerce assistant.

Task:
- Answer user questions naturally.
- Help users with general questions about the store.
- Be friendly and concise.
- If the question is unrelated to shopping, answer normally.
- Do not invent store information.
- If you don't know something, say you don't have that information.

Store topics you can help with:
- Products
- Delivery
- Payment
- Return policy
- Order process
- Account
- Shopping guidance

Rules:
- Return answer only.
- Use Markdown format.
- Keep response under 150 words.

User Message:
"${prompt}"
`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0,
  });

  return {
    intentType: 'GENERAL_QA',
    message: botResponse.choices[0].message.content || ' ',
  };
};
