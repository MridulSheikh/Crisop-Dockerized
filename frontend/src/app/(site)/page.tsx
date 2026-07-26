import AboutUs from "@/components/ui/home/AboutUs";
import AIDeliverySection from "@/components/ui/home/AIDeliverySection";
import Banner from "@/components/ui/home/Banner";
import CustomerReviews from "@/components/ui/home/CustomerReviews";
import FeaturedProducts from "@/components/ui/home/FeaturedProducts";
import OurCategories from "@/components/ui/home/OurCategories";

export default function Home() {
  return (
    <>
      <Banner />
      <FeaturedProducts />
      <OurCategories />
      <AIDeliverySection />
      <AboutUs />
      <CustomerReviews />
    </>
  );
}
