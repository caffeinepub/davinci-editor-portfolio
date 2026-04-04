import { Palette, Scissors, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const TOOLS = [
  {
    icon: Scissors,
    title: "Editing",
    description:
      "Precision cuts, rhythm-driven edits, and narrative structure for competitive gaming content. Every frame tells a story.",
    accentColor: "var(--color-amber)",
  },
  {
    icon: Sparkles,
    title: "Fusion (VFX)",
    description:
      "Motion graphics, compositing, and visual effects using DaVinci Resolve Fusion. Custom overlays, transitions, and HUD elements.",
    accentColor: "var(--color-teal)",
  },
  {
    icon: Palette,
    title: "Color",
    description:
      "Cinematic color grading and correction with DaVinci Resolve's industry-leading Color page. Setting the visual tone of every project.",
    accentColor: "var(--color-amber)",
  },
];

const SKILLS = [
  { label: "Motion Graphics", accent: "amber" },
  { label: "Color Grading", accent: "amber" },
  { label: "Esports Broadcast Graphics", accent: "amber" },
  { label: "Highlight Reel Editing", accent: "teal" },
];

export default function TechStack() {
  return (
    <section
      id="skills"
      className="py-24 px-6"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
            Mastery In
          </h2>
          <div
            className="h-1 w-16 rounded-full"
            style={{ background: "var(--color-amber)" }}
          />
        </motion.div>

        {/* Three cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-sm p-8 border border-[#3d3d3d] hover:border-[#f59e0b]/30 transition-all duration-300"
              style={{ background: "#1a1a1a" }}
              data-ocid="skills.card"
            >
              <div className="mb-5">
                <tool.icon
                  size={28}
                  style={{ color: tool.accentColor }}
                  strokeWidth={1.5}
                />
              </div>
              <h3
                className="text-xl font-bold mb-3 tracking-tight"
                style={{ color: "var(--color-amber)" }}
              >
                {tool.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#a3a3a3" }}
              >
                {tool.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Skills pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3
            className="text-sm font-semibold tracking-[0.2em] uppercase mb-6"
            style={{ color: "#4a4a4a" }}
          >
            Proficiencies
          </h3>
          <div className="flex flex-wrap gap-3">
            {SKILLS.map((skill, i) => (
              <motion.span
                key={skill.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="px-4 py-2 rounded-full text-sm font-medium border"
                style={{
                  background:
                    skill.accent === "amber"
                      ? "oklch(0.75 0.18 60 / 0.1)"
                      : "oklch(0.68 0.13 185 / 0.1)",
                  borderColor:
                    skill.accent === "amber"
                      ? "oklch(0.75 0.18 60 / 0.35)"
                      : "oklch(0.68 0.13 185 / 0.35)",
                  color:
                    skill.accent === "amber"
                      ? "var(--color-amber)"
                      : "var(--color-teal)",
                }}
              >
                {skill.label}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
