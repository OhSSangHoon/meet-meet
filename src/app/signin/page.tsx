import AuthPoster from '@/components/auth/AuthPoster';
import SigninForm from '@/components/auth/SigninForm';

export default function SigninPage() {

    return (
        <div className='w-screen h-screen flex items-center justify-center gap-20'>
            <AuthPoster />
            <SigninForm />
        </div>
    );
}

