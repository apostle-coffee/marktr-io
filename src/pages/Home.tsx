import { 
  Hero, 
  Stats, 
  IntroMessage, 
  HowItWorks, 
  ClosingMessage, 
  ClosingCTA, 
  FeaturesGrid, 
  HumanSupport, 
  TestimonialsRow, 
  ResourcesSection
} from "../components";

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <IntroMessage />
      <HowItWorks />
      <ClosingMessage />
      <ClosingCTA />
      <FeaturesGrid />
      <HumanSupport />
      <TestimonialsRow />
      <ResourcesSection />
    </main>
  );
}
