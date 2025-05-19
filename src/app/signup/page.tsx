import AuthPoster from '@/components/auth/AuthPoster';
import RegisterForm from '@/components/auth/RegisterForm';

export default function SignupPage() {

    return (
        <div className='w-screen h-screen flex items-center justify-center gap-20'>
            <AuthPoster />
            <RegisterForm />
        </div>
    );
}

