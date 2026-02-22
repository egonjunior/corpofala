interface ReaderProgressBarProps {
  progress: number;
  darkMode: boolean;
}

const ReaderProgressBar = ({ progress, darkMode }: ReaderProgressBarProps) => {
  const trackBg = darkMode ? "rgba(255,255,255,0.08)" : "#D4C9BF";
  return (
    <div
      className="fixed left-0 right-0 z-50"
      style={{ top: 52, height: 3, background: trackBg }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: "#C4622D",
          transition: "width 0.3s ease",
        }}
      />
    </div>
  );
};

export default ReaderProgressBar;
