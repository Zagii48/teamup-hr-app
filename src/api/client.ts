import axios, { AxiosInstance, AxiosResponse } from "axios";
import {useAuth} from "@/contexts/AuthContext.tsx";

interface AuthenticationResponse {
    token: string;
    username: string;
    id: number;
}

interface AuthenticationLoginRequest {
    username: string;
    password: string;
}

export interface AuthenticationRegisterRequest {
    username: string;
    password: string;
    email?: string;
    phone?: string;
}

export interface ProfileData {
    id: number;
    username: string;
    phone: string | null;
    email: string | null;
    avatar_url: string | null;
    reliability: number | null;
    stats: {
        totalSignups: number | null;
        attended: number | null;
        noShow: number | null;
        reliabilityPercentage: number | null;
    };
    recentEvents: EventData[] | null;
}

export interface EventData {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    organizerName: string;
    organizerId: number;
    attended: boolean;
}

export function useApi() {
    const { token } = useAuth();

    const api: AxiosInstance = axios.create({
        baseURL: import.meta.env.VITE_BASE_URL,
    });

    api.interceptors.request.use(
        (config) => {
            if (token && config.headers) {
                config.headers.set("Authorization", `Bearer ${token}`);
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    return {
        login: async (
            request: AuthenticationLoginRequest
        ): Promise<AuthenticationResponse> => {
            const res: AxiosResponse<AuthenticationResponse> = await api.post(
                "/authentication/login",
                request
            );
            return res.data;
        },

        register: async (
            request: AuthenticationRegisterRequest
        ): Promise<AuthenticationResponse> => {
            const res: AxiosResponse<AuthenticationResponse> = await api.post(
                "/authentication/register",
                request
            );
            return res.data;
        },

        profile: async (username: string): Promise<ProfileData> => {
            const res: AxiosResponse<ProfileData> = await api.get(
                `/profile/${username}`
            );
            return res.data;
        }
    };
}