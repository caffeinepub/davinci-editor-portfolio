import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { VideoProject } from "../backend.d";
import { useActor } from "./useActor";

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useVideoProjects() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["videoProjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVideoProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useContactSubmissionsCount() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["contactSubmissionsCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getContactSubmissionsCount();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllContactSubmissions() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["contactSubmissions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllContactSubmissions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateVideoProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (project: VideoProject) => {
      if (!actor) throw new Error("Not connected");
      return actor.createVideoProject(project);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videoProjects"] });
    },
  });
}

export function useUpdateVideoProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      project,
    }: { id: bigint; project: VideoProject }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateVideoProject(id, project);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videoProjects"] });
    },
  });
}

export function useDeleteVideoProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteVideoProject(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videoProjects"] });
    },
  });
}

export function useSubmitContactForm() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      name,
      email,
      message,
    }: { name: string; email: string; message: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitContactForm(name, email, message);
    },
  });
}
