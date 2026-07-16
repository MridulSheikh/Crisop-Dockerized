import stringSimilarity from 'string-similarity';

export const extractIds = (
  prompt: string,
  list: { name: string; _id: any }[],
) => {
  const words = prompt.toLowerCase().split(/\s+/);

  return list
    .filter((item) => {
      const brandName = item.name.toLowerCase();

      return words.some(
        (word) => stringSimilarity.compareTwoStrings(word, brandName) > 0.7,
      );
    })
    .map((item) => item._id.toString())
    .join(',');
};

export const extractSearchTerm = (prompt: string, removeWords: string[]) => {
  let text = prompt.toLowerCase();

  // remove brand/category names
  removeWords.forEach((word) => {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    text = text.replace(new RegExp(`\\b${escaped}\\b`, 'gi'), '');
  });

  // remove common phrases
  text = text.replace(
    /\b(do you have|i need|show me|give me|find me|i want|can you show)\b/gi,
    '',
  );

  // remove filler words
  text = text.replace(
    /\b(i|need|some|show|me|want|give|find|available|and|with|the|a|an|for|please|brand)\b/gi,
    '',
  );

  // remove extra spaces
  text = text.replace(/\s+/g, ' ').trim();

  // remove duplicate words
  const uniqueWords = [...new Set(text.split(' '))];

  return uniqueWords.join(' ');
};

export const formatProductsForAI = (products: any[]) => {
  return products
    .map((product, index) => {
      return `
Product ${index + 1}:

ID: ${product._id}

Name: ${product.name}

Category: ${product.category?.name || ""}

Price: ${product.discountPrice} $

Stock: ${product.stock ? "Available" : "Out of stock"}

Tags: ${product.tags?.join(", ") || ""}
`;
    })
    .join("\n-------------------\n");
};


// Data normization
export const normalizeOrder = (order: any) => ({
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

  items: order.items.map((item: any) => ({
    name: item.product.name,
    price: item.price,
    quantity: item.quantity,
    image: item.product.images?.[0]?.url,
  })),
});

export const normalizeProduct = (product: any | any[]) => {
  if (Array.isArray(product)) {
    return product.map(normalizeSingleProduct);
  }

  return normalizeSingleProduct(product);
};

const normalizeSingleProduct = (product: any) => ({
  id: product._id,
  name: product.name,
  price: product.discountPrice ?? product.price,
  regularPrice: product.price,
  category: product?.category?.name ?? null,
  brand: product?.brand?.name ?? null,
  image: product.images?.[0]?.url ?? null,
  inStock: product.isPublished && !product.isDeleted,
  tags: product.tags,
});