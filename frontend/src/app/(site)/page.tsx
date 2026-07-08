import AboutUs from "@/components/ui/home/AboutUs";
import AIDeliverySection from "@/components/ui/home/AIDeliverySection";
import Banner from "@/components/ui/home/Banner";
import OurCategories from "@/components/ui/home/OurCategories";

export default function Home() {
  return (
    <>
      <Banner />
      <OurCategories />
      <AIDeliverySection />
      <AboutUs />
    </>
  );
}
