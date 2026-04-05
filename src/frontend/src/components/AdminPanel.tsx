import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HttpAgent } from "@icp-sdk/core/agent";
import { useQueryClient } from "@tanstack/react-query";
import {
  ImageIcon,
  Loader2,
  Lock,
  LogIn,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { VideoProject } from "../backend.d";
import { loadConfig } from "../config";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useContactSubmissionsCount,
  useCreateVideoProject,
  useDeleteVideoProject,
  useUpdateVideoProject,
  useVideoProjects,
} from "../hooks/useQueries";
import { StorageClient } from "../utils/StorageClient";

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

async function uploadFileToStorage(
  file: File,
  identity: any,
  onProgress: (pct: number) => void,
): Promise<string> {
  const config = await loadConfig();
  const agent = new HttpAgent({
    host: config.backend_host,
    identity,
  });
  if (config.backend_host?.includes("localhost")) {
    await agent.fetchRootKey().catch(() => {});
  }
  const storageClient = new StorageClient(
    config.bucket_name,
    config.storage_gateway_url,
    config.backend_canister_id,
    config.project_id,
    agent,
  );
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { hash } = await storageClient.putFile(bytes, onProgress);
  return storageClient.getDirectURL(hash);
}

function FileUploadField({
  label,
  accept,
  currentUrl,
  onUploaded,
  identity,
}: {
  label: string;
  accept: string;
  currentUrl: string;
  onUploaded: (url: string) => void;
  identity: any;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const isImage = accept.includes("image");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setProgress(0);
    try {
      const url = await uploadFileToStorage(file, identity, setProgress);
      onUploaded(url);
      toast.success(`${label} uploaded`);
    } catch (_err) {
      toast.error(`Failed to upload ${label.toLowerCase()}`);
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <Label className="text-xs mb-1 block" style={{ color: "#a3a3a3" }}>
        {label}
      </Label>
      {/* Preview */}
      {currentUrl && isImage && (
        <div className="mb-2 relative w-full aspect-video rounded-sm overflow-hidden border border-[#3d3d3d]">
          <img
            src={currentUrl}
            alt="thumbnail preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => onUploaded("")}
            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center text-white hover:bg-black/90 transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      )}
      {currentUrl && !isImage && (
        <p
          className="text-xs mb-2 truncate"
          style={{ color: "var(--color-teal)" }}
        >
          ✓ File uploaded
        </p>
      )}
      <div className="flex gap-2 items-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="gap-2 text-xs border-[#3d3d3d] text-[#a3a3a3] hover:text-white flex-1"
          data-ocid="admin.upload_button"
        >
          {uploading ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              Uploading {progress}%
            </>
          ) : (
            <>
              {isImage ? <ImageIcon size={12} /> : <Upload size={12} />}
              {currentUrl ? "Replace" : `Upload ${label}`}
            </>
          )}
        </Button>
        {currentUrl && (
          <span className="text-xs" style={{ color: "#4a4a4a" }}>
            or
          </span>
        )}
      </div>
      {/* Also allow pasting a URL directly */}
      <Input
        value={currentUrl}
        onChange={(e) => onUploaded(e.target.value)}
        placeholder="…or paste a URL"
        className="mt-2 border-[#3d3d3d] text-[#e5e5e5] placeholder:text-[#4a4a4a] text-xs"
        style={{ background: "var(--color-surface)" }}
        data-ocid="admin.input"
      />
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

export default function AdminPanel({ open, onClose }: AdminPanelProps) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { data: projects, isLoading } = useVideoProjects();
  const { data: submissionsCount } = useContactSubmissionsCount();
  const createProject = useCreateVideoProject();
  const updateProject = useUpdateVideoProject();
  const deleteProject = useDeleteVideoProject();

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Admin activation state
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [adminToken, setAdminToken] = useState("");
  const [activating, setActivating] = useState(false);

  // Check if the current user is already admin whenever identity or actor changes
  useEffect(() => {
    if (!identity || !actor) {
      setIsAdmin(null);
      return;
    }
    setIsAdmin(null); // reset to loading while we check
    actor
      .isCallerAdmin()
      .then((result) => setIsAdmin(result))
      .catch(() => setIsAdmin(false));
  }, [identity, actor]);

  const handleActivateAdmin = async () => {
    if (!actor || !adminToken.trim()) return;
    setActivating(true);
    try {
      await actor._initializeAccessControlWithSecret(adminToken.trim());
      // Verify it worked
      const nowAdmin = await actor.isCallerAdmin();
      if (nowAdmin) {
        setIsAdmin(true);
        setAdminToken("");
        // Refresh all queries so projects load fresh
        queryClient.invalidateQueries();
        toast.success("Admin access activated!");
      } else {
        toast.error("Invalid admin token.");
      }
    } catch (_err) {
      toast.error("Invalid admin token.");
    } finally {
      setActivating(false);
    }
  };

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
              ) : isAdmin === null ? (
                /* Checking admin status */
                <div
                  className="text-center py-12"
                  data-ocid="admin.loading_state"
                >
                  <Loader2
                    className="h-6 w-6 animate-spin mx-auto mb-3"
                    style={{ color: "var(--color-amber)" }}
                  />
                  <p className="text-sm" style={{ color: "#a3a3a3" }}>
                    Checking permissions…
                  </p>
                </div>
              ) : !isAdmin ? (
                /* Admin token entry */
                <div className="py-8 space-y-6">
                  <div className="text-center space-y-2">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{
                        background: "#1a1a1a",
                        border: "1px solid #3d3d3d",
                      }}
                    >
                      <Lock size={20} style={{ color: "var(--color-amber)" }} />
                    </div>
                    <h3 className="text-base font-bold text-white">
                      Claim Admin Access
                    </h3>
                    <p className="text-sm" style={{ color: "#a3a3a3" }}>
                      Enter your admin token to unlock content management.
                    </p>
                  </div>
                  <div
                    className="rounded-sm p-5 border border-[#3d3d3d] space-y-4"
                    style={{ background: "#1a1a1a" }}
                    data-ocid="admin.panel"
                  >
                    <div>
                      <Label
                        htmlFor="adminTokenInput"
                        className="text-xs mb-1 block"
                        style={{ color: "#a3a3a3" }}
                      >
                        Admin Token
                      </Label>
                      <Input
                        id="adminTokenInput"
                        type="password"
                        value={adminToken}
                        onChange={(e) => setAdminToken(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleActivateAdmin();
                        }}
                        placeholder="Enter your admin token"
                        className="border-[#3d3d3d] text-[#e5e5e5] placeholder:text-[#4a4a4a]"
                        style={{ background: "var(--color-surface)" }}
                        data-ocid="admin.input"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={handleActivateAdmin}
                      disabled={activating || !adminToken.trim()}
                      className="w-full font-bold gap-2"
                      style={{
                        background: "var(--color-amber)",
                        color: "#0f0f0f",
                      }}
                      data-ocid="admin.submit_button"
                    >
                      {activating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Lock size={15} />
                      )}
                      {activating ? "Activating…" : "Activate Admin"}
                    </Button>
                  </div>
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

                  {/* Upload instructions */}
                  <div
                    className="rounded-sm p-4 border border-dashed border-[#3d3d3d] text-sm"
                    style={{ background: "#111111", color: "#a3a3a3" }}
                  >
                    <p className="font-semibold text-white mb-1">
                      How to add media
                    </p>
                    <ol
                      className="list-decimal list-inside space-y-1 text-xs"
                      style={{ color: "#a3a3a3" }}
                    >
                      <li>
                        Click <strong className="text-white">Edit</strong> next
                        to Gaming Intro or Colour Grading below (or Add New
                        Project to create one).
                      </li>
                      <li>
                        Use{" "}
                        <strong className="text-white">Upload Thumbnail</strong>{" "}
                        to add a cover image, and{" "}
                        <strong className="text-white">Upload Video</strong> for
                        the video file — or paste a URL directly.
                      </li>
                      <li>
                        Hit <strong className="text-white">Save Changes</strong>
                        .
                      </li>
                    </ol>
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

                        <FileUploadField
                          label="Thumbnail Image"
                          accept="image/*"
                          currentUrl={form.thumbnailUrl}
                          onUploaded={(url) =>
                            setForm((f) => ({ ...f, thumbnailUrl: url }))
                          }
                          identity={identity}
                        />

                        <FileUploadField
                          label="Video File"
                          accept="video/*"
                          currentUrl={form.videoUrl}
                          onUploaded={(url) =>
                            setForm((f) => ({ ...f, videoUrl: url }))
                          }
                          identity={identity}
                        />

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
                            {project.thumbnailUrl && (
                              <img
                                src={project.thumbnailUrl}
                                alt=""
                                className="w-12 h-8 object-cover rounded-sm shrink-0 border border-[#3d3d3d]"
                              />
                            )}
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
