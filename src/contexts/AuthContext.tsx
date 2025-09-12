import React, {createContext, useContext, useEffect, useState} from 'react';
import {useLocalStorage} from "@/api/localStorage.ts";

interface User {
    id: number | null;
    username: string | null;
}

interface AuthenticationContext {
    user: User | null;
    token: string | null;
    loading: boolean;
    auth: (auth: Auth) => Promise<void>;
}

export interface Auth {
    user: User | null;
    token: string | null;
}

const AuthContext = createContext<AuthenticationContext | undefined>(undefined);

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useLocalStorage<User | null>("teamup_user", null);
    const [token, setToken] = useLocalStorage<string | null>("teamup_token", null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        setLoading(false);
    }, []);

    const auth = async (auth: Auth) => {
        console.log("Authenticating user:", auth);
        setUser(auth.user);
        setToken(auth.token);
    };

    return (
        <AuthContext.Provider value={{user, token, loading, auth}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}