import AboutUs from "@/components/ui/home/AboutUs";
import AIDeliverySection from "@/components/ui/home/AIDeliverySection";
import Banner from "@/components/ui/home/Banner";
import CrisopAISection from "@/components/ui/home/ChatbotShowcaseSection";
import FAQSection from "@/components/ui/home/Faq";
import FeaturedProducts from "@/components/ui/home/FeaturedProducts";
import OurCategories from "@/components/ui/home/OurCategories";

export default function Home() {
  return (
    <>
      <Banner />
       <OurCategories />
      <FeaturedProducts />
      <CrisopAISection />
      <AIDeliverySection />
      <AboutUs />
      <FAQSection  />
    </>
  );
}
