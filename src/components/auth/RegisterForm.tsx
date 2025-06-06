'use client';

import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import axios from 'axios';
import InputField from './shared/ui/InputField';
import SubmitButton from './shared/ui/SubmitButton';
import FormFooter from './shared/ui/FormFooter';

const signUpFormSchema = z.object({
    name: z.string().min(1, '이름을 입력해 주세요.'),
    email: z.string().min(1, '이메일을 입력해 주세요.').email('올바른 이메일 형식이 아닙니다.'),
    companyName: z.string().min(1, '회사명을 정확하게 입력해 주세요.'),
    password: z
        .string()
        .min(8, '비밀번호가 8자 이상이 되도록 해주세요.'),
});

type SignupFormSchemaType = z.infer<typeof signUpFormSchema>;

export default function RegisterForm() {
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
            await signUp(data.email, data.password, data.name, data.companyName);
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
        <section className='w-[24rem] h-[44.5rem] md:w-[31rem] md:h-[40.5rem] py-4 bg-white rounded-lg shadow-md flex flex-col items-center justify-center'>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='w-4/5 flex flex-col gap-4'>
                <h1 className='text-2xl font-bold text-center'>회원가입</h1>
                <InputField
                    label="이름"
                    id="user-name"
                    type="text"
                    placeholder="이름을 입력해 주세요"
                    {...register('name')}
                    disabled={isSubmitted}
                    error={errors.name?.message}
                />
                <InputField
                    label="아이디"
                    id="email"
                    type="email"
                    placeholder="이메일을 입력해 주세요"
                    {...register('email')}
                    disabled={isSubmitted}
                    error={errors.email?.message}
                    errorResponseMessage={errorResponseMessage}
                />
                <InputField
                    label='회사명'
                    id='company-name'
                    type='text'
                    placeholder='회사명을 입력해 주세요'
                    {...register('companyName')}
                    disabled={isSubmitted}
                    error={errors.companyName?.message}
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
                />
                <div className='w-full flex flex-col gap-2'>
                    <label
                        htmlFor="password-check"
                        className="block text-sm text-gray-900 font-bold"
                    >
                        비밀번호 확인
                    </label>
                    <div className='relative'>
                        <input
                            type={isPasswordCheckVisible ? 'text' : 'password'}
                            id="password-check"
                            className={`w-full rounded-lg bg-gray-50 p-2.5 text-sm text-gray-900 border-2 focus:outline-none ${!isPasswordMatch || !passwordCheck ? 'border-red-600' : 'focus:border-main-300'}`}
                            placeholder="비밀번호를 다시 한 번 입력해 주세요"
                            onChange={(e) => setPasswordCheck(e.target.value)}
                        />
                        <button
                            type='button'
                            className='absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer hover:opacity-60 transition-all duration-200 ease-in-out'
                            onClick={() => setIsPasswordCheckVisible((v) => !v)}
                        >
                            <Image src={isPasswordCheckVisible ? "/icons/visibility_on.svg" : "/icons/visibility_off.svg"} alt="비밀번호 보기 숨김" width={24} height={24} />
                        </button>
                    </div>
                    {!isPasswordMatch || !passwordCheck ? (
                        <span className='text-red-600 text-sm'>비밀번호가 일치하지 않습니다.</span>
                    ) :
                        password.length < 8 ? <span className='text-red-600 text-sm'>비밀번호가 8자 이상이 되도록 해주세요.</span> : <span className='text-green-400 text-sm'>✓</span>
                    }
                </div>
                <SubmitButton
                    isSubmitting={isSubmitting}
                    isPasswordMatch={isPasswordMatch}
                    text="확인"
                    props={{ name, email, companyName, password }}
                />
                <FormFooter
                    route="/login"
                    description="이미 계정이 있으신가요?"
                    text="로그인"
                />
            </form>
        </section>
    );
}

