'use client'

import { usePathname, useRouter } from 'next/navigation';
import { createContext, useState, Dispatch, SetStateAction, useEffect } from "react";
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import dynamic from 'next/dynamic';

const ConfirmDialog = dynamic(() => import('@/components/shared/ui/ConfirmDialog'), { ssr: false });

type AuthContextType = {
    token: string | null;
    loginDialogOpen: boolean;
    setLoginDialogOpen: Dispatch<SetStateAction<boolean>>;
    setToken: Dispatch<SetStateAction<string | null>>;
    signup: (email: string, password: string, name: string, companyName: string) => Promise<void>;
    signin: (email: string, password: string) => Promise<void>;
    signout: () => Promise<void>;
    userName: string;
    userId: number;
};

export const AuthContext = createContext<AuthContextType>({
    token: null,
    loginDialogOpen: false,
    setLoginDialogOpen: () => { },
    setToken: () => { },
    signup: async () => { },
    signin: async () => { },
    signout: async () => { },
    userName: '',
    userId: 0
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [previousPath, setPreviousPath] = useState<string>('/');
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [signupDialogOpen, setSignupDialogOpen] = useState(false);
    const queryClient = useQueryClient();

    const router = useRouter();
    const pathname = usePathname();

    const signup = async (email: string, password: string, name: string, companyName: string) => {
        try {
            const result = await axios.post('/api/auth/signup', { email, password, name, companyName })
            if (result.status === 200) {
                setSignupDialogOpen(true);
                router.replace('/login')
            }
        } catch (error) {
            throw error;
        }
    }

    const signin = async (email: string, password: string) => {
        try {
            const result = await axios.post('/api/auth/signin', { email, password });
            if (result.status === 200) {
                localStorage.setItem('token', result.data.token);
                setToken(result.data.token);
                await fetchUser(result.data.token);
                router.replace(previousPath);
            }
        } catch (error) {
            throw error;
        }
    }

    const fetchUser = async (token: string) => {
        try {
            const result = await axios.post('/api/auth/fetch-user', { token });
            if (result.status === 200) {
                localStorage.setItem('user_id', result.data.id);
                localStorage.setItem('user_email', result.data.email);
                localStorage.setItem('user_name', result.data.name);
                localStorage.setItem('user_company_name', result.data.companyName);
                localStorage.setItem('user_image', result.data.image);
                setUserName(result.data.name);
                setUserId(result.data.id);
            }
        } catch (error) {
            throw error;
        }
    }

    const signout = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_company_name');
        localStorage.removeItem('user_image');
        setToken(null);
        setUserId(0);
        setUserName('');
        queryClient.invalidateQueries({ queryKey: ['checkGatheringJoined'] });
        await axios.post('/api/auth/signout');
    }

    // 페이지 이동 시 토큰, 유저명, 유저 아이디 감지
    useEffect(() => {
        const checkAuth = () => {
            const storedToken = localStorage.getItem('token');
            const userName = localStorage.getItem('user_name'), userId = localStorage.getItem('user_id');
            if (userName) setUserName(userName);
            if (userId) setUserId(Number(userId));
            if (storedToken) setToken(storedToken);
            setIsLoading(false);
        };
        checkAuth();
    }, []);

    useEffect(() => {
        // 마이페이지 접근 시 로그인 확인
        if (!isLoading && !token && pathname.startsWith('/mypage')) setLoginDialogOpen(true);
        // 로그인 후 이전 경로 저장
        if (pathname !== '/login' && !pathname.includes('/auth/')) setPreviousPath(pathname);
        // 로그인 후 로그인 페이지 접근 시 이전 경로로 이동
        if (!isLoading && token && pathname === '/login') router.replace(previousPath);
    }, [isLoading, token, pathname, router, previousPath]);

    const handleLoginModalConfirm = () => {
        setLoginDialogOpen(false);
        router.replace('/login');
    };

    const handleSignupModalConfirm = () => {
        setSignupDialogOpen(false);
        router.replace('/');
    };

    return (
        <AuthContext value={{ token, userName, userId, loginDialogOpen, setLoginDialogOpen, setToken, signup, signin, signout }}>
            {children}
            <ConfirmDialog
                open={loginDialogOpen}
                onClose={handleLoginModalConfirm}
                text="로그인이 필요합니다"
            />
            <ConfirmDialog
                open={signupDialogOpen}
                onClose={handleSignupModalConfirm}
                text="회원가입이 완료되었습니다"
            />
        </AuthContext>
    );
}
