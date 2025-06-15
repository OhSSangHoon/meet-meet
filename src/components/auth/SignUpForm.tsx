'use client';

import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cleanXSS } from '@/utils/shared/excapeForXSS';
import Image from 'next/image';
import axios from 'axios';
import InputField from '@/components/auth/shared/ui/InputField';
import SubmitButton from '@/components/auth/shared/ui/SubmitButton';
import FormFooter from '@/components/auth/shared/ui/FormFooter';

const signUpFormSchema = z.object({
    name: z.string().min(1, '이름을 입력해 주세요.').max(20, '이름은 20자 이하로 입력해 주세요.'),
    email: z.string().min(1, '이메일을 입력해 주세요.').max(30, '이메일은 30자 이하로 입력해 주세요.').email('올바른 이메일 형식이 아닙니다.'),
    companyName: z.string().min(1, '크루 이름을 정확하게 입력해 주세요.').max(20, '크루 이름은 20자 이하로 입력해 주세요.'),
    password: z.string().min(8, '비밀번호가 8자 이상이 되도록 해주세요.').refine(
        (password) => {
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
            const hasNumber = /\d/.test(password);
            const hasLowercase = /[a-z]/.test(password);
            return hasSpecialChar && hasNumber && hasLowercase;
        },
        { message: '영문 소문자, 숫자, 특수문자를 포함해야 합니다.' }
    ),
});

type SignupFormSchemaType = z.infer<typeof signUpFormSchema>;

export default function SignUpForm() {
    const { signUp } = useContext(AuthContext)

    const [passwordCheck, setPasswordCheck] = useState('');
    const [isPasswordMatch, setIsPasswordMatch] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isPasswordCheckVisible, setIsPasswordCheckVisible] = useState(false);
    const [errorResponseMessage, setErrorResponseMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting, isSubmitted },
    } = useForm<SignupFormSchemaType>({
        resolver: zodResolver(signUpFormSchema),
    });

    const name = watch('name');
    const email = watch('email');
    const companyName = watch('companyName');
    const password = watch('password');

    const onSubmit = async (data: SignupFormSchemaType) => {
        try {
            await signUp(cleanXSS(data.email), cleanXSS(data.password), cleanXSS(data.name), cleanXSS(data.companyName));
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const serverError = error?.response?.data?.error;
                setErrorResponseMessage(serverError.message);
            }
        }
    }

    useEffect(() => {
        setIsPasswordMatch(password === passwordCheck);
    }, [password, passwordCheck]);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className='w-4/5 flex flex-col gap-4'
        >
            <InputField
                label="이름"
                id="user-name"
                type="text"
                placeholder="이름을 입력해 주세요"
                {...register('name')}
                disabled={isSubmitted}
                isError={errors.name?.message}
            />
            <InputField
                label="이메일"
                id="email"
                type="email"
                placeholder="이메일을 입력해 주세요"
                {...register('email')}
                disabled={isSubmitted}
                isError={errors.email?.message}
                errorResponseMessage={errorResponseMessage}
            />
            <InputField
                label='크루'
                id='company-name'
                type='text'
                placeholder='크루 이름을 입력해 주세요'
                {...register('companyName')}
                disabled={isSubmitted}
                isError={errors.companyName?.message}
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
            />
            <div className='w-full flex flex-col gap-2'>
                <label
                    htmlFor="password-check"
                    className="block text-sm font-bold dark:text-white"
                >
                    비밀번호 확인
                </label>
                <div className='relative'>
                    <input
                        type={isPasswordCheckVisible ? 'text' : 'password'}
                        id="password-check"
                        className={`w-full rounded-lg bg-gray-50 p-2.5 text-sm border-2 focus:outline-none ${!isPasswordMatch ? 'border-red-600' : 'focus:border-main-300'}`}
                        placeholder="비밀번호를 다시 한 번 입력해 주세요"
                        onChange={(e) => setPasswordCheck(e.target.value)}
                    />
                    <button
                        type='button'
                        className='absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer hover:opacity-60 transition-all duration-200 ease-in-out'
                        onClick={() => setIsPasswordCheckVisible((v) => !v)}
                    >
                        <Image
                            src={isPasswordCheckVisible ? "https://res.cloudinary.com/dbvzbdffi/image/upload/v1749713866/visibility_on_jh4sec.svg" : "https://res.cloudinary.com/dbvzbdffi/image/upload/v1749713865/visibility_off_qtspno.svg"}
                            alt="비밀번호 보기 숨김"
                            width={24}
                            height={24} />
                    </button>
                </div>
                {!passwordCheck && password?.length > 0 && <span className='text-red-600 text-sm'>비밀번호가 일치하지 않습니다.</span>}
                {isPasswordMatch && password?.length > 0 && <span className='text-green-400 text-sm'>✓</span>}
            </div>
            <SubmitButton
                isSubmitting={isSubmitting}
                isPasswordMatch={isPasswordMatch}
                text="확인"
                props={{ name, email, companyName, password }}
            />
            <FormFooter
                route="/auth/signin"
                description="이미 계정이 있으신가요?"
                text="로그인"
            />
        </form>
    );
}

