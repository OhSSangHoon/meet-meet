import { Metadata } from 'next';
import AuthPoster from '@/components/auth/shared/ui/AuthPoster';
import SignInForm from '@/components/auth/SignInForm';

export const metadata: Metadata = {
    title: `로그인 | Meet Meet`,
    description: `로그인 페이지 입니다.`,
};

export default function SignInPage() {
    return (
        <div className='w-full h-full py-20 flex flex-col lg:flex-row items-center justify-center gap-0 lg:gap-20'>
            <AuthPoster />
            <SignInForm />
        </div>
    );
}

