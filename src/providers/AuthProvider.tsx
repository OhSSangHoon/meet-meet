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
    userName: string;
};

export const AuthContext = createContext<AuthContextType>({
    token: null,
    setToken: () => { },
    signup: async () => { },
    signin: async () => { },
    signout: async () => { },
    userName: ''
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [previousPath, setPreviousPath] = useState<string>('/');
    const [userName, setUserName] = useState('');

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
                localStorage.setItem('user_name', result.data.name);
                localStorage.setItem('user_id', result.data.id);
                localStorage.setItem('user_company_name', result.data.companyName);
                localStorage.setItem('user_image', result.data.image);
                setUserName(result.data.name);
            }
        } catch (error) {
            throw error;
        }
    }

    const signout = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_company_name');
        localStorage.removeItem('user_image');
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

    // 유저 이름 감지
    useEffect(() => {
        const userName = localStorage.getItem('user_name');
        if (userName) setUserName(userName);
    }, []);

    useEffect(() => {
        if (pathname !== '/signin' && !pathname.includes('/auth/')) setPreviousPath(pathname);
    }, [pathname]);

    useEffect(() => {
        if (!isLoading && !token && pathname.startsWith('/mypage')) {
            alert('로그인이 필요합니다.')
            router.replace('/signin');
        }

        if (!isLoading && token && pathname === '/signin') router.replace(previousPath);
    }, [isLoading, token, pathname, router, previousPath]);

    return (
        <AuthContext.Provider value={{ token, setToken, signup, signin, signout, userName }}>
            {children}
        </AuthContext.Provider>
    );
}
