import { Metadata } from 'next';
import AuthPoster from '@/components/auth/shared/ui/AuthPoster';
import SignUpForm from '@/components/auth/SignUpForm';

export const metadata: Metadata = {
    title: `회원가입 | Meet Meet`,
    description: `회원가입 페이지 입니다.`,
};

export default function SignUpPage() {
    return (
        <div className='w-full h-full py-20 flex flex-col lg:flex-row items-center justify-center gap-0 lg:gap-20'>
            <AuthPoster />
            <section className='w-[24rem] h-[44.5rem] md:w-[31rem] md:h-[40.5rem] py-4 bg-white dark:bg-dark-2 rounded-lg shadow-md flex flex-col items-center justify-center'>
                <h1 className='text-2xl font-bold text-center dark:text-white'>회원가입</h1>
                <SignUpForm />
            </section>
        </div>
    );
}

