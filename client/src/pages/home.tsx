import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { DemoSection } from "@/components/demo-section";
import { WorkflowSection } from "@/components/workflow-section";
import { AnalyticsSection } from "@/components/analytics-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { Particles } from "@/components/ui/particles";

export default function Home() {
  return (
    <div className="min-h-screen bg-ai-dark text-white relative">
      <Particles count={15} />
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      <WorkflowSection />
      <AnalyticsSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
