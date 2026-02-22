import { useState, useEffect } from "react";

export const PhoneStatusBar = () => {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  );

  useEffect(() => {
    const iv = setInterval(
      () => setTime(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })),
      1000
    );
    return () => clearInterval(iv);
  }, []);

  return (
    <div
      className="flex items-center justify-between px-4 w-full"
      style={{
        height: 44,
        backgroundColor: "#000",
      }}
    >
      {/* Time */}
      <span
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: "#fff",
          fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif',
        }}
      >
        {time}
      </span>

      {/* Right icons */}
      <div className="flex items-center gap-1.5">
        {/* Signal bars */}
        <svg width="16" height="12" viewBox="0 0 16 12">
          <rect x="0" y="8" width="3" height="4" rx="0.5" fill="white" />
          <rect x="4" y="5" width="3" height="7" rx="0.5" fill="white" />
          <rect x="8" y="2" width="3" height="10" rx="0.5" fill="white" />
          <rect x="12" y="0" width="3" height="12" rx="0.5" fill="white" opacity="0.3" />
        </svg>
        {/* 4G label */}
        <span style={{ fontSize: 11, fontWeight: 600, color: "#fff", marginLeft: 2 }}>4G</span>
        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12">
          <rect x="0.5" y="0.5" width="20" height="11" rx="2" stroke="white" strokeWidth="1" fill="none" />
          <rect x="2" y="2" width="14" height="8" rx="1" fill="white" />
          <rect x="21" y="3.5" width="2.5" height="5" rx="1" fill="white" opacity="0.4" />
        </svg>
      </div>
    </div>
  );
};
