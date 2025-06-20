import { Metadata } from 'next';
import AuthPoster from '@/components/auth/AuthPoster';
import SignUpForm from '@/components/auth/SignUpForm';

export const metadata: Metadata = {
    title: `회원가입 | Meet Meet`,
    description: `회원가입 페이지 입니다.`,
};

export default function SignUpPage() {
    return (
        <main className="w-full h-full px-4 sm:px-0 py-10 pt-20 flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-20">
            <AuthPoster />
            <section className="w-[20rem] md:w-[31rem] px-6 sm:px-0 py-4 rounded-lg shadow-md border bg-white dark:bg-dark-2 flex flex-col items-center justify-center">
                <h1 className='text-2xl font-bold text-center dark:text-white'>회원가입</h1>
                <SignUpForm />
            </section>
        </main>
    );
}

