import { motion } from "framer-motion";

interface PulseLoaderProps {
    text?: string;
    size?: number;
    color?: string;
}

const PulseLoader = ({ text = "Carregando...", size = 40, color = "#C4622D" }: PulseLoaderProps) => (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 32 32"
            fill="none"
            animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
            <circle cx="16" cy="16" r="3.2" fill={color} />
            <motion.circle
                cx="16" cy="16" r="7.5"
                stroke={color} strokeWidth="1.2"
                animate={{ opacity: [0.15, 0.4, 0.15], r: [7.5, 8, 7.5] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.circle
                cx="16" cy="16" r="12"
                stroke={color} strokeWidth="1"
                animate={{ opacity: [0.06, 0.2, 0.06], r: [12, 13, 12] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            />
        </motion.svg>
        {text && (
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: 300,
                    color: "#8A7A70",
                }}
            >
                {text}
            </motion.p>
        )}
    </div>
);

export default PulseLoader;
