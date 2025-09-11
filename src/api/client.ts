import axios, {AxiosResponse} from 'axios';
import UserSession from './userData';

interface AuthenticationResponse {
    token: string;
    username: string;
    email?: string;
    id?: number;
    error?: string;
}

interface AuthenticationLoginRequest {
    username: string;
    password: string;
}

interface AuthenticationRegisterRequest {
    username: string;
    password: string;
    email?: string;
}

class Client {
    private static baseUrl: string = import.meta.env.VITE_BASE_URL;

    private static initialized = (() => {
        axios.interceptors.request.use((config) => {
            const user = UserSession.getUser();
            if (user?.token) {
                if (config.headers)
                    config.headers['Authorization'] = `Bearer ${user.token}`;
            }
            return config;
        });
        return true;
    })();

    static async login(request: AuthenticationLoginRequest): Promise<AuthenticationResponse> {
        const res: AxiosResponse<AuthenticationResponse> = await axios.post(
            `${Client.baseUrl}/authentication/login`,
            request
        );
        return res.data;
    }

    static async register(request: AuthenticationRegisterRequest): Promise<AuthenticationResponse> {
        const res: AxiosResponse<AuthenticationResponse> = await axios.post(
            `${Client.baseUrl}/authentication/register`,
            request
        );
        return res.data;
    }
}

export default Client;