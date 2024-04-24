import { useState, ReactNode, createContext } from "react";

interface AuthContextData {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credencials : SignInProps) => Promise<void>
}

interface UserProps {
    id: string;
    name: string;
    email: string;
    endereco: string | null;
    subscriptions: SubscriptionsProps | null;
}

type AuthProviderProps = {
    children: ReactNode
}

interface SubscriptionsProps {
    id: string;
    status: string;
}

interface SignInProps {
    email: string;
    password: string;
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState<UserProps>();
    const isAuthenticated = !!user;

    async function signIn({ email, password }: SignInProps) {
        console.log({
            email,
            password
        })
    }
    return (
        <AuthContext.Provider value={{ user, isAuthenticated , signIn }}>
            {children}
        </AuthContext.Provider>
    )
}