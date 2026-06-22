import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import LiveCommandDemo from "@/components/LiveCommandDemo";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <LiveCommandDemo />
    </>
  );
}
