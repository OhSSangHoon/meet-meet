'use client';

import { useContext, useState } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import InputField from './shared/ui/InputField';
import SubmitButton from './shared/ui/SubmitButton';
import FormFooter from './shared/ui/FormFooter';

const signInFormSchema = z.object({
    email: z.string().email('올바른 이메일 형식이 아닙니다.'),
    password: z
        .string()
        .min(8, '비밀번호는 8자 이상이어야 합니다.')
});

type SignInFormSchemaType = z.infer<typeof signInFormSchema>;

export default function LoginForm() {
    const { signIn } = useContext(AuthContext);

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errorResponseMessage, setErrorResponseMessage] = useState<string | null>(null);

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitted },
    } = useForm<SignInFormSchemaType>({
        resolver: zodResolver(signInFormSchema)
    });

    const email = watch('email');
    const password = watch('password');

    const onSubmit = async (data: SignInFormSchemaType) => {
        setErrorResponseMessage(null);
        try {
            await signIn(data.email, data.password);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const serverError = error?.response?.data?.error;
                if (serverError) setErrorResponseMessage(serverError.message);
                else setErrorResponseMessage('로그인 처리 중 오류가 발생했습니다.');
            } else {
                setErrorResponseMessage('알 수 없는 오류가 발생했습니다.');
                console.log(error);
            }
        }
    };

    return (
        <section className='w-[24rem] md:w-[31rem] h-[26.5rem] py-4 bg-white rounded-lg shadow-md flex flex-col items-center justify-center'>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='w-4/5 flex flex-col gap-8'
            >
                <h1 className='text-2xl font-bold text-center'>로그인</h1>
                <InputField
                    label="아이디"
                    id="email"
                    type="email"
                    placeholder="이메일을 입력해 주세요"
                    {...register('email')}
                    disabled={isSubmitted}
                    error={errors.email?.message}
                />
                <InputField
                    label='비밀번호'
                    id='password'
                    type='password'
                    placeholder='비밀번호를 입력해 주세요'
                    {...register('password')}
                    disabled={isSubmitted}
                    handlePasswordVisibility={() => setIsPasswordVisible((v) => !v)}
                    isPasswordVisible={isPasswordVisible}
                    error={errors.password?.message}
                    errorResponseMessage={errorResponseMessage}
                />
                <SubmitButton
                    isSubmitting={isSubmitting}
                    isPasswordMatch={true}
                    text="로그인"
                    props={{ email, password }}
                />
                <FormFooter
                    route="/register"
                    description="MeetMeet이 처음이신가요?"
                    text="회원가입"
                />
            </form>
        </section>
    );
}

