import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { UseCases } from "@/components/landing/UseCases";
import { DemoVideo } from "@/components/landing/DemoVideo";
import { BringYourModel } from "@/components/landing/BringYourModel";
import { PricingCards } from "@/components/landing/PricingCards";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <UseCases />
        <DemoVideo />
        <BringYourModel />
        <PricingCards compact />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
