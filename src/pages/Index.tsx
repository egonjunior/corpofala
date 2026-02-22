import HeroSection from "@/components/landing/HeroSection";
import RecognitionSection from "@/components/landing/RecognitionSection";
import OriginSection from "@/components/landing/OriginSection";
import DiscoverySection from "@/components/landing/DiscoverySection";
import CredibilitySection from "@/components/landing/CredibilitySection";
import CTASection from "@/components/landing/CTASection";
import ResearchJourneySection from "@/components/landing/ResearchJourneySection";
import ValidationSection from "@/components/landing/ValidationSection";
import CasesSection from "@/components/landing/CasesSection";
import PatternsSection from "@/components/landing/PatternsSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <RecognitionSection />
      <OriginSection />
      <DiscoverySection />
      <CredibilitySection />
      <CTASection />
      <ResearchJourneySection />
      <ValidationSection />
      <CasesSection />
      <PatternsSection />
      <Footer />
    </main>
  );
};

export default Index;
