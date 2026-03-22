import { ArrowDown } from "lucide-react";
import { motion } from "motion/react";

export default function Hero() {
  const scrollToWork = () => {
    document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden noise-overlay"
      style={{
        background:
          "linear-gradient(135deg, #1a1a1a 0%, #1e1e1e 50%, #1a1a1a 100%)",
      }}
    >
      {/* Background gradient accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, oklch(0.75 0.18 60 / 0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-black text-white leading-none tracking-tight mb-4"
          style={{ fontSize: "clamp(3rem, 9vw, 6.5rem)" }}
        >
          Tired of getting
          <br />
          <span style={{ color: "var(--color-amber)" }}>bad retention?</span>
        </motion.h1>

        {/* Animated line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="h-px w-full max-w-md mx-auto mb-8 origin-left"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--color-amber), transparent)",
          }}
        />

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light"
          style={{ color: "#a3a3a3" }}
        >
          Increase your retention with video editing.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            type="button"
            onClick={scrollToWork}
            className="group inline-flex items-center gap-2 px-8 py-4 rounded font-bold text-sm tracking-wider uppercase transition-all duration-200 hover:shadow-amber-glow hover:scale-105 active:scale-95"
            style={{ background: "var(--color-amber)", color: "#0f0f0f" }}
            data-ocid="hero.primary_button"
          >
            View My Work
            <ArrowDown
              size={16}
              className="group-hover:translate-y-1 transition-transform"
            />
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span
          className="text-xs tracking-widest uppercase"
          style={{ color: "#4a4a4a" }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{ color: "#4a4a4a" }}
        >
          <ArrowDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  );
}
