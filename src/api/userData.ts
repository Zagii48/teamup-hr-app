export interface UserData {
    id?: number;
    username?: string;
    email?: string;
    token?: string;
}

class UserSession {
    private static user: UserData | null = null;

    static setUser(user: UserData) {
        UserSession.user = user;
    }

    static getUser(): UserData | null {
        return UserSession.user;
    }

    static clear() {
        UserSession.user = null;
    }

    static isAuthenticated(): boolean {
        return UserSession.user !== null;
    }
}

export default UserSession;