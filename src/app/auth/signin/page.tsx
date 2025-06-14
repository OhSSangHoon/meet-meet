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
            <section className='w-[24rem] md:w-[31rem] h-[26.5rem] py-4 bg-white dark:bg-dark-2 rounded-lg shadow-md flex flex-col items-center justify-center'>
                <h1 className='text-2xl font-bold text-center dark:text-white'>로그인</h1>
                <SignInForm />
            </section>
        </div>
    );
}

