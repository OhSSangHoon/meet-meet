import AuthPoster from '@/components/auth/shared/ui/AuthPoster';
import SignUpForm from '@/components/auth/SignUpForm';

export default function SignUpPage() {

    return (
        <div className='w-full h-full py-20 flex flex-col lg:flex-row items-center justify-center gap-0 lg:gap-20'>
            <AuthPoster />
            <SignUpForm />
        </div>
    );
}

