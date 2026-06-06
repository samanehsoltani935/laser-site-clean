import HeroSection from "@/components/site/HeroSection";
import FeatureCards from "@/components/site/FeatureCards";
import ServiceSteps from "@/components/site/ServiceSteps";
import StatsSection from "@/components/site/StatsSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureCards />
      <ServiceSteps />
      <StatsSection />
    </>
  );
}
