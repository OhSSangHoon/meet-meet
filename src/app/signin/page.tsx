import AuthPoster from '@/components/auth/AuthPoster';
import LoginForm from '@/components/auth/LoginForm';

export default function SigninPage() {

    return (
        <div className='w-screen h-screen flex items-center justify-center gap-20'>
            <AuthPoster />
            <LoginForm />
        </div>
    );
}

