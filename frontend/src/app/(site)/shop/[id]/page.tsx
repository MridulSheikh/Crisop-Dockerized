import ProductDetailsClient from "@/components/ui/products/ProductDetailsClient";

async function getProduct(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${id}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export default async function ProductDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const productData = await getProduct(id);
  const product = productData?.data;
  return <ProductDetailsClient product={product} />;
}