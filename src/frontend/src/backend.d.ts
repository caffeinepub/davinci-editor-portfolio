import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ContactFormSubmission {
    id: bigint;
    name: string;
    email: string;
    message: string;
    timestamp: bigint;
}
export interface VideoProject {
    id: bigint;
    title: string;
    thumbnailUrl: string;
    category: string;
    videoUrl: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createVideoProject(project: VideoProject): Promise<bigint>;
    deleteVideoProject(id: bigint): Promise<void>;
    getAllContactSubmissions(): Promise<Array<ContactFormSubmission>>;
    getAllVideoProjects(): Promise<Array<VideoProject>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactSubmissionsCount(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitContactForm(name: string, email: string, message: string): Promise<bigint>;
    updateVideoProject(id: bigint, project: VideoProject): Promise<void>;
}
