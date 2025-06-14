'use client'

import { createContext, useState, Dispatch, SetStateAction, useEffect } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { INTERNAL_PATHS } from '@/lib/api/apiPaths';
import { internalClient } from '@/lib/api/clientFetchers';
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
            const result = await internalClient.post(INTERNAL_PATHS.SIGN_UP, { email, password, name, companyName })
            if (result.status === 200 || result.status === 201) {
                const signInResult = await internalClient.post(INTERNAL_PATHS.SIGN_IN, { email, password });
                if (signInResult.status === 200) {
                    localStorage.setItem('token', signInResult.data.token);
                    setToken(signInResult.data.token);
                    await fetchUser();
                    setSignUpDialogOpen(true);
                }
            }
        } catch (error) {
            throw error;
        }
    }

    const signIn = async (email: string, password: string) => {
        try {
            const result = await internalClient.post(INTERNAL_PATHS.SIGN_IN, { email, password });
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
            const result = await internalClient.get(INTERNAL_PATHS.USER);
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
                localStorage.setItem('token_issued_at', Date.now().toString());
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
        localStorage.removeItem('token_issued_at');
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

    /** 페이지 이동 시 유저 정보 감지 */
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

    /** Protect Routes */
    useEffect(() => {
        if (isLoading) return; // 로딩 중이면 아무것도 하지 않음
        if (!token && pathname === '/mypage') setSignInDialogOpen(true); // 마이페이지: 로그인 필요
        if (!token && pathname === '/saved') setSignInDialogOpen(true); // 찜한 모임: 로그인 필요
        if (!pathname.includes('/auth')) setPreviousPath(pathname); // 로그인 후 이전 경로 저장
        if (token && pathname === '/auth/signin') router.replace(previousPath); // 로그인: 로그인 되어있는 경우, 이전 경로로 이동
        if (token && pathname === '/auth/signup') router.replace('/'); // 회원가입: 로그인 되어있는 경우, 메인페이지로 이동(이건 직접 주소 입력으로 뚫고 들어오는 경우 때문에 추가)
    }, [isLoading, token, pathname, router, previousPath]);

    const handleSignInModalConfirm = () => {
        setSignInDialogOpen(false);
        router.replace('/auth/signin');
    };

    const handleSignUpModalConfirm = () => {
        setSignUpDialogOpen(false);
        router.replace('/auth/profile');
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
