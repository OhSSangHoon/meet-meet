'use client'

import { createContext, useState, Dispatch, SetStateAction, useEffect } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { INTERNAL_PATHS } from '@/lib/api/apiPaths';
import { apiClient } from '@/lib/api/clientFetchers';
import axios from 'axios';
import dynamic from 'next/dynamic';

const ConfirmDialog = dynamic(() => import('@/components/shared/ui/ConfirmDialog'), { ssr: false });

type AuthContextType = {
    token: string | null;
    signInDialogOpen: boolean;
    setSignInDialogOpen: Dispatch<SetStateAction<boolean>>;
    setToken: Dispatch<SetStateAction<string | null>>;
    signUp: (email: string, password: string, name: string, companyName: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    updateUserProfile: (data: { name: string, id: number, email: string, companyName: string, image: string }) => void;
    userName: string;
    userId: number;
    userEmail: string;
    userCompanyName: string;
    userImage: string;
};

export const AuthContext = createContext<AuthContextType>({
    token: null,
    signInDialogOpen: false,
    setSignInDialogOpen: () => { },
    setToken: () => { },
    signUp: async () => { },
    signIn: async () => { },
    signOut: async () => { },
    updateUserProfile: () => { },
    userName: '',
    userId: 0,
    userEmail: '',
    userCompanyName: '',
    userImage: '',
});


export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [userName, setUserName] = useState('이름');
    const [userId, setUserId] = useState(0);
    const [userEmail, setUserEmail] = useState('이메일');
    const [userCompanyName, setUserCompanyName] = useState('회사명');
    const [userImage, setUserImage] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const [previousPath, setPreviousPath] = useState<string>('/');
    const [signInDialogOpen, setSignInDialogOpen] = useState(false);
    const [signUpDialogOpen, setSignUpDialogOpen] = useState(false);
    const queryClient = useQueryClient();

    const router = useRouter();
    const pathname = usePathname();

    const signUp = async (email: string, password: string, name: string, companyName: string) => {
        try {
            const result = await apiClient.post(INTERNAL_PATHS.SIGN_UP, { email, password, name, companyName })
            if (result.status === 200 || result.status === 201) setSignUpDialogOpen(true);
        } catch (error) {
            throw error;
        }
    }

    const signIn = async (email: string, password: string) => {
        try {
            const result = await apiClient.post(INTERNAL_PATHS.SIGN_IN, { email, password });
            if (result.status === 200) {
                localStorage.setItem('token', result.data.token);
                setToken(result.data.token);
                await fetchUser();
                router.replace(previousPath);
            }
        } catch (error) {
            throw error;
        }
    }

    const fetchUser = async () => {
        try {
            const result = await apiClient.get(INTERNAL_PATHS.USER);
            if (result.status === 200) {
                setUserName(result.data.name);
                setUserId(result.data.id);
                setUserEmail(result.data.email);
                setUserCompanyName(result.data.companyName);
                setUserImage(result.data.image);
                localStorage.setItem('user_id', result.data.id);
                localStorage.setItem('user_email', result.data.email);
                localStorage.setItem('user_name', result.data.name);
                localStorage.setItem('user_company_name', result.data.companyName);
                localStorage.setItem('user_image', result.data.image);
            }
        } catch (error) {
            throw error;
        }
    }

    const signOut = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_company_name');
        localStorage.removeItem('user_image');
        setToken(null);
        setUserId(0);
        setUserName('');
        setUserEmail('');
        setUserCompanyName('');
        setUserImage('');
        queryClient.clear();
        await axios.post(INTERNAL_PATHS.SIGN_OUT);
    }

    const updateUserProfile = (data: { name: string, id: number, email: string, companyName: string, image: string }) => {
        localStorage.setItem('user_id', data.id.toString());
        localStorage.setItem('user_email', data.email);
        localStorage.setItem('user_name', data.name);
        localStorage.setItem('user_company_name', data.companyName);
        localStorage.setItem('user_image', data.image);
        setUserName(data.name);
        setUserId(data.id);
        setUserEmail(data.email);
        setUserCompanyName(data.companyName);
        setUserImage(data.image);
    };


    // 페이지 이동 시 토큰, 유저명, 유저 아이디 감지 (처음 한 번)
    useEffect(() => {
        const checkAuth = () => {
            const storedToken = localStorage.getItem('token');
            const userName = localStorage.getItem('user_name');
            const userId = localStorage.getItem('user_id');
            const userEmail = localStorage.getItem('user_email');
            const userCompanyName = localStorage.getItem('user_company_name');
            const userImage = localStorage.getItem('user_image');
            const VALID_USER_IMAGE = userImage && userImage !== 'null' && userImage !== '';

            if (storedToken) setToken(storedToken);
            if (userName) setUserName(userName);
            if (userId) setUserId(Number(userId));
            if (userEmail) setUserEmail(userEmail);
            if (userCompanyName) setUserCompanyName(userCompanyName);
            if (VALID_USER_IMAGE) setUserImage(userImage);
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    useEffect(() => {
        if (isLoading) return; // 로딩 중이면 아무것도 하지 않음
        if (!token && pathname.startsWith('/mypage')) setSignInDialogOpen(true); // 마이페이지 접근 시 로그인 확인
        if (pathname !== '/signin' && !pathname.includes('/auth/')) setPreviousPath(pathname); // 로그인 후 이전 경로 저장
        if (token && pathname === '/signin') router.replace(previousPath); // 로그인 후 로그인 페이지 접근 시 이전 경로로 이동
    }, [isLoading, token, pathname, router, previousPath]);

    const handleSignInModalConfirm = () => {
        setSignInDialogOpen(false);
        router.replace('/signin');
    };

    const handleSignUpModalConfirm = () => {
        setSignUpDialogOpen(false);
        router.replace('/signin');
    };

    if (isLoading) return null;

    return (
        <AuthContext value={{
            token,
            userName,
            userId,
            userEmail,
            userCompanyName,
            userImage,
            signInDialogOpen,
            setSignInDialogOpen,
            setToken,
            signUp,
            signIn,
            signOut,
            updateUserProfile
        }}>
            {children}
            <ConfirmDialog
                isOpen={signInDialogOpen}
                onClose={handleSignInModalConfirm}
                text="로그인이 필요합니다"
            />
            <ConfirmDialog
                isOpen={signUpDialogOpen}
                onClose={handleSignUpModalConfirm}
                text="회원가입이 완료되었습니다"
            />
        </AuthContext>
    );
}
