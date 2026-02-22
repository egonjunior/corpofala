import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import LPHeader from "@/components/lp2/LPHeader";
import LPHeroSection from "@/components/lp2/LPHeroSection";
import LPDiagnostico from "@/components/lp2/LPDiagnostico";
import LP3Camadas from "@/components/lp2/LP3Camadas";
import LPLivro from "@/components/lp2/LPLivro";
import LPExperiencia from "@/components/lp2/LPExperiencia";
import LPDinamicas from "@/components/lp2/LPDinamicas";
import LPCiencia from "@/components/lp2/LPCiencia";
import LPDepoimentos from "@/components/lp2/LPDepoimentos";
import LPCTAFinal from "@/components/lp2/LPCTAFinal";
import LPFooter from "@/components/lp2/LPFooter";
import AuthModal from "@/components/lp2/AuthModal";

const LandingPage = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"create" | "login">("create");

  useScrollReveal();

  const openAuth = (tab: "create" | "login" = "create") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  return (
    <>
      <main className="min-h-screen">
        <LPHeader onOpenAuth={openAuth} />
        <LPHeroSection onOpenAuth={() => openAuth("create")} />
        <LPDiagnostico />
        <LP3Camadas />
        <LPLivro />
        <LPExperiencia onOpenAuth={() => openAuth("create")} />
        <LPDinamicas onOpenAuth={() => openAuth("create")} />
        <LPCiencia />
        <LPDepoimentos />
        <LPCTAFinal onOpenAuth={() => openAuth("create")} />
        <LPFooter />
      </main>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialTab={authTab} />
    </>
  );
};

export default LandingPage;
