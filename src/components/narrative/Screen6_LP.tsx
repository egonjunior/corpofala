import { useState, useEffect, useRef, useCallback } from "react";
import LPHero from "@/components/lp/LPHero";
import LPRecognition from "@/components/lp/LPRecognition";
import LPOverDelivery from "@/components/lp/LPOverDelivery";
import LPPricing from "@/components/lp/LPPricing";
import LPGuarantee from "@/components/lp/LPGuarantee";
import LPClosing from "@/components/lp/LPClosing";
import LPFloatBar from "@/components/lp/LPFloatBar";

const Screen6_LP = () => {
  const [showFloatBar, setShowFloatBar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const progress = el.scrollTop / (el.scrollHeight - el.clientHeight);
    setShowFloatBar(progress > 0.25);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-y-auto relative"
      style={{ backgroundColor: "#080810" }}
    >
      {/* Global grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      <LPHero />
      <LPRecognition />
      <LPOverDelivery />
      <LPPricing />
      <LPGuarantee />
      <LPClosing />
      <LPFloatBar visible={showFloatBar} />
    </div>
  );
};

export default Screen6_LP;
