export const getDiscountPercentage = (price: number, discountPrice: number) => {
  if (!price || price <= 0) return 0;

  const discount = price - discountPrice;
  return Math.round((discount / price) * 100);
};