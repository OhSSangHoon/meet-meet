import AuthPoster from '@/components/auth/AuthPoster';
import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {

    return (
        <div className='w-screen h-screen flex items-center justify-center gap-20'>
            <AuthPoster />
            <SignupForm />
        </div>
    );
}

