import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NarrativeAudioProvider } from "@/contexts/NarrativeAudioContext";
import Screen0_Pulse from "@/components/narrative/Screen0_Pulse";
import Screen1_Archive from "@/components/narrative/Screen1_Archive";
import Screen2_Phone from "@/components/narrative/Screen2_Phone";
import Screen3_Call from "@/components/narrative/Screen3_Call";
import Screen4_WhatsApp from "@/components/narrative/Screen4_WhatsApp";
import Screen5_TikTok from "@/components/narrative/Screen5_TikTok";
import Screen6_LP from "@/components/narrative/Screen6_LP";

type ScreenIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const NarrativeLP = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenIndex>(0);

  const nextScreen = () => {
    setCurrentScreen((prev) => (prev < 6 ? (prev + 1) as ScreenIndex : prev));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 0:
        return <Screen0_Pulse onNext={nextScreen} />;
      case 1:
        return <Screen1_Archive onNext={nextScreen} />;
      case 2:
        return <Screen2_Phone onNext={nextScreen} />;
      case 3:
        return <Screen3_Call onNext={nextScreen} />;
      case 4:
        return <Screen4_WhatsApp onNext={nextScreen} />;
      case 5:
        return <Screen5_TikTok onNext={nextScreen} />;
      case 6:
        return <Screen6_LP />;
      default:
        return <Screen0_Pulse onNext={nextScreen} />;
    }
  };

  return (
    <NarrativeAudioProvider>
      <div className="relative w-full h-screen overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>
    </NarrativeAudioProvider>
  );
};

export default NarrativeLP;
