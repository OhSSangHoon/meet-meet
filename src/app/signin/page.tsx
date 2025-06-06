import AuthPoster from '@/components/auth/shared/ui/AuthPoster';
import SignInForm from '@/components/auth/SignInForm';

export default function SignInPage() {

    return (
        <div className='w-full h-full py-20 flex flex-col lg:flex-row items-center justify-center gap-0 lg:gap-20'>
            <AuthPoster />
            <SignInForm />
        </div>
    );
}

