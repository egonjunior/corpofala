import { motion } from "framer-motion";

const SectionDivider = () => (
  <motion.div
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="my-16 mx-auto h-px w-32 bg-primary/30 origin-center"
  />
);

export default SectionDivider;
