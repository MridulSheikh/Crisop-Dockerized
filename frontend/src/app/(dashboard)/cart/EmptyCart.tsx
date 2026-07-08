import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const EmptyCart = () => {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] w-full flex justify-center items-center px-4">
      <div className="p-8 bg-white rounded-xl shadow-sm text-center max-w-sm w-full">
        
        {/* Image */}
        <div className="flex justify-center mb-4">
          <Image
            src="/img/empty-cart.png"
            alt="Empty Cart"
            width={150}
            height={150}
            className="opacity-90"
          />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800">
          Your cart is empty
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-gray-500 mt-2">
          Looks like you haven’t added anything yet.
          Start shopping to fill it up 🛒
        </p>

        {/* CTA Button */}
        <Button
          onClick={() => router.push("/shop")}
          className="mt-5 w-full bg-green-600 hover:bg-green-700"
        >
          Browse Products
        </Button>
      </div>
    </div>
  );
};

export default EmptyCart;