import { Play, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { VideoProject } from "../backend.d";
import { useVideoProjects } from "../hooks/useQueries";

const SAMPLE_PROJECTS: VideoProject[] = [
  {
    id: BigInt(1),
    title: "Gaming Video Intro",
    category: "Spec Projects",
    thumbnailUrl: "",
    videoUrl: "",
  },
  {
    id: BigInt(2),
    title: "Reel / Short",
    category: "Spec Projects",
    thumbnailUrl: "",
    videoUrl: "",
  },
  {
    id: BigInt(3),
    title: "Games Colour Correction",
    category: "Spec Projects",
    thumbnailUrl: "",
    videoUrl: "",
  },
  {
    id: BigInt(4),
    title: "Sound Design",
    category: "Spec Projects",
    thumbnailUrl: "",
    videoUrl: "",
  },
];

const RE_CREATES = new Set([
  "Gaming Video Intro",
  "Reel / Short",
  "Sound Design",
]);

const DESCRIPTIONS: Record<string, string> = {
  "Gaming Video Intro":
    "High-energy intro sequences built for gaming brands. Fast cuts, motion graphics, and cinematic grading that hook viewers in the first 30 seconds.",
  "Reel / Short":
    "Vertical and horizontal reels designed to maximise watch time. Punchy pacing, sound design sync, and platform-native formatting.",
  "Games Colour Correction":
    "Full colour pipeline in DaVinci Resolve — from raw footage to polished cinematic look. Consistent tone across every frame.",
  "Sound Design":
    "Custom audio layers, SFX placement, and music sync that elevate the emotional impact of every cut.",
};

function MediaPanel({
  project,
  onClick,
}: { project: VideoProject; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`View project: ${project.title}`}
      className="group relative w-full aspect-video rounded-sm overflow-hidden border border-[#2d2d2d] hover:border-[#f59e0b] transition-all duration-300 cursor-pointer"
      style={{ background: "#111111" }}
    >
      {project.thumbnailUrl ? (
        <img
          src={project.thumbnailUrl}
          alt={project.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(var(--color-amber) 1px, transparent 1px), linear-gradient(90deg, var(--color-amber) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-[#f59e0b]/40 group-hover:border-[#f59e0b] group-hover:bg-[#f59e0b]/10 transition-all duration-300">
            <Play
              size={28}
              className="ml-1"
              style={{ color: "var(--color-amber)" }}
              fill="currentColor"
            />
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
    </button>
  );
}

function TextPanel({
  project,
  index,
}: { project: VideoProject; index: number }) {
  const description = DESCRIPTIONS[project.title] ?? "";
  const label = RE_CREATES.has(project.title) ? "Re-creates" : "Previous Works";
  return (
    <div className="flex flex-col justify-center px-2 md:px-8">
      <span
        className="text-xs font-semibold tracking-[0.2em] uppercase mb-3 block"
        style={{ color: "var(--color-teal)" }}
      >
        {label}
      </span>
      <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-4 leading-tight">
        {project.title}
      </h3>
      <div
        className="h-px w-12 mb-5"
        style={{ background: "var(--color-amber)" }}
      />
      <p className="text-base leading-relaxed" style={{ color: "#a3a3a3" }}>
        {description}
      </p>
      <span
        className="mt-6 text-xs tracking-[0.15em] uppercase font-semibold"
        style={{ color: "#4a4a4a" }}
      >
        #{index + 1}
      </span>
    </div>
  );
}

export default function VideoGallery() {
  const [lightboxProject, setLightboxProject] = useState<VideoProject | null>(
    null,
  );
  const { data: backendProjects } = useVideoProjects();

  const projects =
    backendProjects && backendProjects.length > 0
      ? backendProjects
      : SAMPLE_PROJECTS;

  return (
    <section id="work" className="py-24 px-6" style={{ background: "#1a1a1a" }}>
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
            Previous Works / Re-creates
          </h2>
          <div
            className="h-1 w-16 rounded-full"
            style={{ background: "var(--color-amber)" }}
          />
        </motion.div>

        {/* Alternating panels */}
        <div className="flex flex-col gap-20">
          {projects.map((project, i) => {
            const mediaLeft = i % 2 === 0;
            return (
              <motion.div
                key={String(project.id)}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
                data-ocid={`work.item.${i + 1}`}
              >
                {mediaLeft ? (
                  <>
                    <MediaPanel
                      project={project}
                      onClick={() =>
                        project.videoUrl
                          ? setLightboxProject(project)
                          : undefined
                      }
                    />
                    <TextPanel project={project} index={i} />
                  </>
                ) : (
                  <>
                    <TextPanel project={project} index={i} />
                    <MediaPanel
                      project={project}
                      onClick={() =>
                        project.videoUrl
                          ? setLightboxProject(project)
                          : undefined
                      }
                    />
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.92)" }}
            onClick={() => setLightboxProject(null)}
            data-ocid="work.modal"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video rounded-sm overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={lightboxProject.videoUrl}
                className="w-full h-full"
                allow="autoplay; fullscreen"
                title={lightboxProject.title}
              />
              <button
                type="button"
                onClick={() => setLightboxProject(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-black/60 text-white hover:bg-black/90 transition-colors"
                data-ocid="work.close_button"
              >
                <X size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
