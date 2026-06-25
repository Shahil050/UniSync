"use client";

import { HeroSection } from "../components/home/HeroSection";
import { HowItWorksSection } from "../components/home/HowItWorksSection";
import { FeatureHighlights } from "../components/home/FeatureHighlights";
import { AboutSection } from "../components/home/AboutSection";
import { ContactSection } from "../components/home/ContactSection";
import { Footer } from "../components/Footer";
import { useUser } from "../UserContext";

export function HomePage() {
  const { openLogin, openSignup } = useUser();

  return (
    <>
      <HeroSection
        onLoginClick={openLogin}
        onSignupClick={openSignup}
      />
      <HowItWorksSection />
      <FeatureHighlights />
      <AboutSection />
      <ContactSection />
      <Footer />
    </>
  );
}