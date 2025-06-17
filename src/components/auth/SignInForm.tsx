'use client';

import { useContext, useState } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { excapeForXSS } from '@/utils/shared/excapeForXSS';
import axios from 'axios';
import InputField from '@/components/auth/InputField';
import SubmitButton from '@/components/auth/SubmitButton';
import AuthSwitchLink from '@/components/auth/AuthSwitchLink';

const signInFormSchema = z.object({
    email: z.string().email('올바른 이메일 형식이 아닙니다.'),
    password: z
        .string()
        .min(8, '비밀번호는 8자 이상이어야 합니다.')
});

type SignInFormSchemaType = z.infer<typeof signInFormSchema>;

export default function SignInForm() {
    const { signIn } = useContext(AuthContext);

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errorResponseMessage, setErrorResponseMessage] = useState<string | null>(null);

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitted },
    } = useForm<SignInFormSchemaType>({
        resolver: zodResolver(signInFormSchema),
    });

    const email = watch('email');
    const password = watch('password');

    const onSubmit = async (data: SignInFormSchemaType) => {
        setErrorResponseMessage(null);
        try {
            await signIn(excapeForXSS(data.email), excapeForXSS(data.password));
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const serverError = error?.response?.data?.error;
                if (serverError) setErrorResponseMessage(serverError.message);
                else setErrorResponseMessage('로그인 처리 중 오류가 발생했습니다.');
            } else {
                setErrorResponseMessage('알 수 없는 오류가 발생했습니다.');
            }
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className='w-4/5 flex flex-col gap-8'
        >
            <InputField
                label="이메일"
                id="email"
                type="email"
                placeholder="이메일을 입력해 주세요"
                {...register('email')}
                disabled={isSubmitted}
                isError={errors.email?.message}
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
                isError={errors.password?.message}
                errorResponseMessage={errorResponseMessage}
            />
            <SubmitButton
                isSubmitting={isSubmitting}
                isPasswordMatch={true}
                text="로그인"
                props={{ email, password }}
            />
            <AuthSwitchLink
                route="/auth/signup"
                description="MeetMeet이 처음이신가요?"
                text="회원가입"
            />
        </form>
    );
}
