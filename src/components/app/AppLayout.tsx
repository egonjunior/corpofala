import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import AppHeader from "./AppHeader";
import AppTabBar from "./AppTabBar";
import CrisisButton from "./CrisisButton";
import PageTransition from "./PageTransition";

const AppLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: `
          radial-gradient(ellipse 60% 50% at 50% 0%, rgba(196,98,45,0.03) 0%, transparent 70%),
          radial-gradient(ellipse 50% 40% at 90% 100%, rgba(0,188,212,0.02) 0%, transparent 70%),
          #F2EDE4
        `,
      }}
    >
      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[60]"
        style={{
          opacity: 0.02,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      <AppHeader />

      <main className="pt-14 pb-20 md:pb-8">
        <PageTransition key={location.pathname}>
          {children}
        </PageTransition>
      </main>

      <AppTabBar />
      <CrisisButton />
    </div>
  );
};

export default AppLayout;
