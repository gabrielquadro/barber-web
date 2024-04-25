import { useState, ReactNode, createContext, useEffect } from "react";
import { destroyCookie, setCookie, parseCookies } from "nookies";
import Router from "next/router";
import { api } from "../services/apiClient";

interface AuthContextData {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credencials: SignInProps) => Promise<void>
    signUp: (credencials: SignUpProps) => Promise<void>
    logoutUser: () => Promise<void>
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

interface SignUpProps {
    name: string;
    email: string;
    password: string;
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut() {
    console.log('Error signout')
    try {
        destroyCookie(null, '@barber.token', { path: '/' })
        Router.push('/login');
    } catch (err) {
        console.log('Erro ao sair');
    }
}


export function AuthProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState<UserProps>();
    const isAuthenticated = !!user;

    //verificação de token
    useEffect(() => {
        const { '@barber.token': token } = parseCookies();

        if (token) {
            api.get('/me').then(response => {
                const { id, name, endereco, email, subscriptions } = response.data;
                setUser({
                    id,
                    name,
                    email,
                    endereco,
                    subscriptions
                })
            })
                .catch(() => {
                    signOut();
                })
        }

    }, [])

    async function signIn({ email, password }: SignInProps) {
        try {
            const response = await api.post('/session', {
                email,
                password
            })

            const { id, name, token, subscriptions, endereco } = response.data;

            setCookie(undefined, '@barber.token', token, {
                maxAge: 60 * 60 * 24 * 30, //expira em 1 mes
                patch: '/'
            })

            setUser({
                id,
                name,
                email,
                endereco,
                subscriptions
            })

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`

            Router.push('/dashboard');

        } catch (err) {
            console.log('Erro ao entrar', err);
        }
    }

    async function signUp({ name, email, password }: SignUpProps) {
        try {
            const response = await api.post('/user', {
                name,
                email,
                password
            })

            Router.push('/login');

        } catch (err) {
            console.log('Erro ao cadastrar', err);
        }
    }

    async function logoutUser() {
        try {
            destroyCookie(null, '@barber.token', { path: '/' })
            setUser(null)
            Router.push('/login');
        } catch (err) {
            console.log('Erro ao sair', err);
        }
    }


    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            signIn,
            signUp,
            logoutUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}