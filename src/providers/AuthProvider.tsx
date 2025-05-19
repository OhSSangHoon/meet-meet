'use client'

import { usePathname, useRouter } from 'next/navigation';
import { createContext, useState, Dispatch, SetStateAction, useEffect } from "react";
import axios from 'axios';

type AuthContextType = {
    token: string | null;
    setToken: Dispatch<SetStateAction<string | null>>;
    signup: (email: string, password: string, name: string, companyName: string) => Promise<void>;
    signin: (email: string, password: string) => Promise<void>;
    signout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
    token: null,
    setToken: () => { },
    signup: async () => { },
    signin: async () => { },
    signout: async () => { }
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [previousPath, setPreviousPath] = useState<string>('/');

    const router = useRouter();
    const pathname = usePathname();

    const signup = async (email: string, password: string, name: string, companyName: string) => {
        try {
            const result = await axios.post('/api/auth/signup', { email, password, name, companyName })
            if (result.status === 200) {
                alert('회원가입이 완료되었습니다.')
                router.replace('/signin')
            }
        } catch (error) {
            throw error;
        }
    }

    const signin = async (email: string, password: string) => {
        try {
            const result = await axios.post('/api/auth/signin', { email, password });
            if (result.status === 200) {
                alert('로그인에 성공했습니다.')
                localStorage.setItem('token', result.data.token);
                setToken(result.data.token);
                fetchUser(result.data.token);
                router.replace('/');
            }
        } catch (error) {
            throw error;
        }
    }

    const fetchUser = async (token: string) => {
        try {
            const result = await axios.post('/api/auth/fetch-user', { token });
            if (result.status === 200) {
                console.log(result.data);
                localStorage.setItem('user_name', JSON.stringify(result.data.name));
                localStorage.setItem('user_id', JSON.stringify(result.data.id));
                localStorage.setItem('user_company_name', JSON.stringify(result.data.companyName));
                localStorage.setItem('user_image', JSON.stringify(result.data.image));
            }
        } catch (error) {
            throw error;
        }
    }

    const signout = async () => {
        localStorage.removeItem('token');
        setToken(null);
        const result = await axios.post('/api/auth/signout');
        if (result.status === 200) console.log('로그아웃에 성공했습니다.')
    }

    // 페이지 이동 시 토큰 감지
    useEffect(() => {
        const initAuth = () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) setToken(storedToken);
            setIsLoading(false);
        };

        initAuth();
    }, []);

    useEffect(() => {
        if (pathname !== '/signin' && !pathname.includes('/auth/')) {
            setPreviousPath(pathname);
            console.log('Previous path set to:', pathname);
        }
    }, [pathname]);

    useEffect(() => {
        if (!isLoading && !token && pathname.startsWith('/mypage')) {
            console.log('AuthProvider: 로그인이 필요합니다.');
            alert('로그인이 필요합니다.')
            router.replace('/signin');
        }

        if (!isLoading && token && pathname === '/signin') {
            router.replace(previousPath);
        }
    }, [isLoading, token, pathname, router, previousPath]);

    return (
        <AuthContext.Provider value={{ token, setToken, signup, signin, signout }}>
            {children}
        </AuthContext.Provider>
    );
}
