'use client';

import { useContext, useState } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { regexEmail, regexPassword } from './shared/utils/vaildator';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';

export default function SigninForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errorResponseMessage, setErrorResponseMessage] = useState<string | null>(null);

    const { signin } = useContext(AuthContext);



    const handlePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsPasswordVisible(!isPasswordVisible);
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        setEmailError(!regexEmail(value));
        setErrorResponseMessage(null);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        setPasswordError(!regexPassword(value));
        setErrorResponseMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorResponseMessage(null);

        if (!email || email === '') {
            alert('이메일을 입력해주세요')
            return;
        }

        if (!password || password === '') {
            alert('비밀번호를 입력해주세요')
            return;
        }

        try {
            await signin(email, password)
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
    }

    return (
        <section className='w-[31rem] py-4 bg-white rounded-lg shadow-md flex flex-col items-center justify-center'>
            <form
                onSubmit={handleSubmit}
                className='w-4/5 flex flex-col gap-8'>
                <h1 className='text-2xl font-bold text-center'>로그인</h1>
                <div className='w-full flex flex-col gap-2'>
                    <label
                        htmlFor="email"
                        className="block text-sm text-gray-900 font-bold"
                    >
                        아이디
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="block w-full p-2.5 rounded-lg bg-gray-50 text-sm text-gray-900 border-2 focus:outline-none focus:border-main-300"
                        placeholder="이메일을 입력해주세요"
                        onChange={handleEmailChange}
                        required
                    />
                    {errorResponseMessage ? (
                        <span className='text-red-600 text-sm'>{errorResponseMessage}</span>
                    ) : !email ? (
                        <span className='text-red-600 text-sm'>이메일을 입력해 주세요.</span>
                    ) : email && emailError ? (
                        <span className='text-red-600 text-sm'>올바른 이메일 형식이 아닙니다.</span>
                    ) : email && !emailError ? (
                        <span className='text-green-500 text-sm'>✓</span>
                    ) : null}
                </div>
                <div className=' w-full flex flex-col gap-2'>
                    <label
                        htmlFor="password"
                        className="block text-sm text-gray-900 font-bold"
                    >
                        비밀번호
                    </label>
                    <div className='relative'>
                        <input
                            type={isPasswordVisible ? 'text' : 'password'}
                            id="password"
                            className="w-full rounded-lg bg-gray-50 p-2.5 text-sm text-gray-900 border-2 focus:outline-none focus:border-main-300"
                            placeholder="비밀번호를 입력해주세요"
                            onChange={handlePasswordChange}
                            required
                        />
                        <button
                            type='button'
                            className='absolute right-2.5 top-1/4 cursor-pointer hover:opacity-60 transition-all duration-200 ease-in-out'
                            onClick={handlePasswordVisibility}
                        >
                            <Image src={isPasswordVisible ? "/images/visibility_on.svg" : "/images/visibility_off.svg"} alt="비밀번호 보기 숨김" width={24} height={24} />
                        </button>
                    </div>
                    {!password ? (
                        <span className='text-red-600 text-sm'>비밀번호를 입력해 주세요.</span>
                    ) : password && passwordError ? (
                        <span className='text-red-600 text-sm'>8자 이상 영문, 숫자, 특수문자를 최소 1개 이상 포함</span>
                    ) : password && !passwordError ? (
                        <span className='text-green-500 text-sm'>✓</span>
                    ) : null}
                </div>
                <button
                    type="submit"
                    className={`w-full rounded-lg ${emailError || passwordError ? 'bg-gray-400' : 'bg-main-300'} px-5 py-2.5 text-center text font-bold text-white cursor-pointer transition-all duration-300 ease-in-out`}
                >
                    로그인
                </button>
                <p className='text-center text-sm text-gray-400'>
                    MeetMeet이 처음이신가요? <Link className="underline text-main-500" href="/signup">회원가입</Link>
                </p>
            </form >
        </section >
    );
}

