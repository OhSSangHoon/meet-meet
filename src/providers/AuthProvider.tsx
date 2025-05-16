'use client'

import { usePathname, useRouter } from 'next/navigation';
import { createContext, useState, Dispatch, SetStateAction, useEffect } from "react";

type AuthContextType = {
    token: string | null;
    setToken: Dispatch<SetStateAction<string | null>>;
};

export const AuthContext = createContext<AuthContextType>({
    token: null,
    setToken: () => { }
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) setToken(token);
    }, [token, setToken])

    useEffect(() => {
        if (pathname.startsWith('/mypage') && !token) router.replace('/signin');
    }, [pathname, token, router])

    useEffect(() => {
        if (pathname === '/signin' && token) router.replace('/');
    }, [pathname, token, router]);

    return (
        <AuthContext value={{ token, setToken }}>
            {children}
        </AuthContext>
    );
}
