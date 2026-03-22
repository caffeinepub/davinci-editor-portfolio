import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, LogIn, Pencil, Plus, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { VideoProject } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useContactSubmissionsCount,
  useCreateVideoProject,
  useDeleteVideoProject,
  useUpdateVideoProject,
  useVideoProjects,
} from "../hooks/useQueries";

const EMPTY_FORM = {
  title: "",
  thumbnailUrl: "",
  videoUrl: "",
  category: "Spec Projects",
};

interface AdminPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminPanel({ open, onClose }: AdminPanelProps) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: projects, isLoading } = useVideoProjects();
  const { data: submissionsCount } = useContactSubmissionsCount();
  const createProject = useCreateVideoProject();
  const updateProject = useUpdateVideoProject();
  const deleteProject = useDeleteVideoProject();

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [showForm, setShowForm] = useState(false);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (project: VideoProject) => {
    setForm({
      title: project.title,
      thumbnailUrl: project.thumbnailUrl,
      videoUrl: project.videoUrl,
      category: project.category,
    });
    setEditingId(project.id);
    setShowForm(true);
  };

  const handleSubmitForm = () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    const projectData: VideoProject = {
      id: editingId ?? BigInt(0),
      title: form.title,
      thumbnailUrl: form.thumbnailUrl,
      videoUrl: form.videoUrl,
      category: form.category,
    };
    if (editingId !== null) {
      updateProject.mutate(
        { id: editingId, project: projectData },
        {
          onSuccess: () => {
            toast.success("Project updated");
            resetForm();
          },
          onError: () => toast.error("Failed to update"),
        },
      );
    } else {
      createProject.mutate(projectData, {
        onSuccess: () => {
          toast.success("Project created");
          resetForm();
        },
        onError: () => toast.error("Failed to create"),
      });
    }
  };

  const handleDelete = (id: bigint) => {
    deleteProject.mutate(id, {
      onSuccess: () => toast.success("Project deleted"),
      onError: () => toast.error("Failed to delete"),
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg overflow-y-auto"
            style={{
              background: "var(--color-surface)",
              borderLeft: "1px solid #3d3d3d",
            }}
            data-ocid="admin.sheet"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#3d3d3d]">
              <h2 className="text-lg font-bold text-white">Admin Panel</h2>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded text-[#a3a3a3] hover:text-white transition-colors"
                data-ocid="admin.close_button"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-6 space-y-8">
              {!identity ? (
                /* Login prompt */
                <div className="text-center py-12 space-y-4">
                  <p className="text-sm" style={{ color: "#a3a3a3" }}>
                    Log in to manage your portfolio.
                  </p>
                  <Button
                    onClick={() => login()}
                    disabled={loginStatus === "logging-in"}
                    className="gap-2 font-bold"
                    style={{
                      background: "var(--color-amber)",
                      color: "#0f0f0f",
                    }}
                    data-ocid="admin.primary_button"
                  >
                    {loginStatus === "logging-in" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogIn size={16} />
                    )}
                    Log In
                  </Button>
                </div>
              ) : (
                <>
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className="rounded-sm p-4 text-center"
                      style={{ background: "#1a1a1a" }}
                    >
                      <div
                        className="text-2xl font-black"
                        style={{ color: "var(--color-amber)" }}
                      >
                        {projects?.length ?? 0}
                      </div>
                      <div
                        className="text-xs mt-1"
                        style={{ color: "#a3a3a3" }}
                      >
                        Projects
                      </div>
                    </div>
                    <div
                      className="rounded-sm p-4 text-center"
                      style={{ background: "#1a1a1a" }}
                    >
                      <div
                        className="text-2xl font-black"
                        style={{ color: "var(--color-teal)" }}
                      >
                        {submissionsCount !== undefined
                          ? String(submissionsCount)
                          : "—"}
                      </div>
                      <div
                        className="text-xs mt-1"
                        style={{ color: "#a3a3a3" }}
                      >
                        Messages
                      </div>
                    </div>
                  </div>

                  {/* Add/Edit form */}
                  {showForm ? (
                    <div
                      className="rounded-sm p-5 border border-[#3d3d3d]"
                      style={{ background: "#1a1a1a" }}
                      data-ocid="admin.panel"
                    >
                      <h3 className="text-sm font-bold text-white mb-4">
                        {editingId !== null
                          ? "Edit Project"
                          : "Add New Project"}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label
                            className="text-xs mb-1 block"
                            style={{ color: "#a3a3a3" }}
                          >
                            Title *
                          </Label>
                          <Input
                            value={form.title}
                            onChange={(e) =>
                              setForm((f) => ({ ...f, title: e.target.value }))
                            }
                            placeholder="Project title"
                            className="border-[#3d3d3d] text-[#e5e5e5] placeholder:text-[#4a4a4a]"
                            style={{ background: "var(--color-surface)" }}
                            data-ocid="admin.input"
                          />
                        </div>
                        <div>
                          <Label
                            className="text-xs mb-1 block"
                            style={{ color: "#a3a3a3" }}
                          >
                            Category
                          </Label>
                          <Select
                            value={form.category}
                            onValueChange={(v) =>
                              setForm((f) => ({ ...f, category: v }))
                            }
                          >
                            <SelectTrigger
                              className="border-[#3d3d3d] text-[#e5e5e5]"
                              style={{ background: "var(--color-surface)" }}
                              data-ocid="admin.select"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent
                              style={{ background: "var(--color-surface)" }}
                            >
                              <SelectItem value="Spec Projects">
                                Spec Projects
                              </SelectItem>
                              <SelectItem value="Creative Re-cuts">
                                Creative Re-cuts
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label
                            className="text-xs mb-1 block"
                            style={{ color: "#a3a3a3" }}
                          >
                            Thumbnail URL
                          </Label>
                          <Input
                            value={form.thumbnailUrl}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                thumbnailUrl: e.target.value,
                              }))
                            }
                            placeholder="https://..."
                            className="border-[#3d3d3d] text-[#e5e5e5] placeholder:text-[#4a4a4a]"
                            style={{ background: "var(--color-surface)" }}
                            data-ocid="admin.input"
                          />
                        </div>
                        <div>
                          <Label
                            className="text-xs mb-1 block"
                            style={{ color: "#a3a3a3" }}
                          >
                            Video URL
                          </Label>
                          <Input
                            value={form.videoUrl}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                videoUrl: e.target.value,
                              }))
                            }
                            placeholder="https://..."
                            className="border-[#3d3d3d] text-[#e5e5e5] placeholder:text-[#4a4a4a]"
                            style={{ background: "var(--color-surface)" }}
                            data-ocid="admin.input"
                          />
                        </div>
                        <div className="flex gap-3 pt-2">
                          <Button
                            type="button"
                            onClick={handleSubmitForm}
                            disabled={
                              createProject.isPending || updateProject.isPending
                            }
                            className="flex-1 font-bold text-sm"
                            style={{
                              background: "var(--color-amber)",
                              color: "#0f0f0f",
                            }}
                            data-ocid="admin.save_button"
                          >
                            {(createProject.isPending ||
                              updateProject.isPending) && (
                              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            )}
                            {editingId !== null
                              ? "Save Changes"
                              : "Add Project"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={resetForm}
                            className="border-[#3d3d3d] text-[#a3a3a3] hover:text-white"
                            data-ocid="admin.cancel_button"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => setShowForm(true)}
                      className="w-full gap-2 font-bold border border-dashed border-[#3d3d3d] text-[#a3a3a3] hover:text-white hover:border-[#f59e0b] bg-transparent hover:bg-transparent transition-colors"
                      data-ocid="admin.primary_button"
                    >
                      <Plus size={16} /> Add New Project
                    </Button>
                  )}

                  {/* Projects list */}
                  <div>
                    <h3
                      className="text-xs font-semibold tracking-[0.2em] uppercase mb-4"
                      style={{ color: "#4a4a4a" }}
                    >
                      Projects
                    </h3>
                    {isLoading ? (
                      <div
                        className="text-center py-8"
                        data-ocid="admin.loading_state"
                      >
                        <Loader2
                          className="h-5 w-5 animate-spin mx-auto"
                          style={{ color: "#4a4a4a" }}
                        />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {(projects ?? []).map((project, i) => (
                          <div
                            key={String(project.id)}
                            className="flex items-start gap-3 p-3 rounded-sm border border-[#3d3d3d]"
                            style={{ background: "#1a1a1a" }}
                            data-ocid={`admin.item.${i + 1}`}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">
                                {project.title}
                              </p>
                              <p
                                className="text-xs mt-0.5"
                                style={{ color: "var(--color-teal)" }}
                              >
                                {project.category}
                              </p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => startEdit(project)}
                                className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 transition-colors"
                                style={{ color: "#a3a3a3" }}
                                aria-label={`Edit ${project.title}`}
                                data-ocid={`admin.edit_button.${i + 1}`}
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(project.id)}
                                className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-500/20 transition-colors"
                                style={{ color: "#a3a3a3" }}
                                aria-label={`Delete ${project.title}`}
                                data-ocid={`admin.delete_button.${i + 1}`}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                        {(projects ?? []).length === 0 && (
                          <p
                            className="text-sm text-center py-6"
                            style={{ color: "#4a4a4a" }}
                            data-ocid="admin.empty_state"
                          >
                            No projects yet. Add one above.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
