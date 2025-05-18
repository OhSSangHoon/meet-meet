'use client';

import { useContext, useState } from 'react';
import { regexEmail, regexPassword } from './shared/utils/vaildator';
import { AuthContext } from '@/providers/AuthProvider';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';

export default function SignupForm() {
    const [name, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordCheckError, setPasswordCheckError] = useState(false);

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isPasswordCheckVisible, setIsPasswordCheckVisible] = useState(false);

    const [errorResponseMessage, setErrorResponseMessage] = useState<string | null>(null);

    const { signup } = useContext(AuthContext)


    const handlePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsPasswordVisible(!isPasswordVisible);
    }

    const handlePasswordCheckVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsPasswordCheckVisible(!isPasswordCheckVisible);
    }

    const handleUsernameValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUsername(value);
    };

    const handleCompanyNameValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCompanyName(value);
    };

    const handleEmailValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        setEmailError(!regexEmail(value));
    };

    const handlePasswordValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        setPasswordError(!regexPassword(value));
    };

    const handlePasswordCheckValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPasswordCheck(value);
        setPasswordCheckError(!regexPassword(value));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!name || name === '') {
            alert('이름을 입력해주세요')
            return;
        }

        if (!email || email === '') {
            alert('이메일을 입력해주세요')
            return;
        }

        if (!companyName || companyName === '') {
            alert('회사명을 입력해주세요')
            return;
        }

        if (!password || password === '') {
            alert('비밀번호를 입력해주세요')
            return;
        }

        try {
            await signup(email, password, name, companyName);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const serverError = error?.response?.data?.error;
                setErrorResponseMessage(serverError.message);
            }
        }
    }

    return (
        <section className='w-[31rem] py-4 bg-white rounded-lg shadow-md flex flex-col items-center justify-center'>
            <form
                onSubmit={handleSubmit}
                className='w-4/5 flex flex-col gap-4'>
                <h1 className='text-2xl font-bold text-center'>회원가입</h1>
                <div className='w-full flex flex-col gap-2'>
                    <label
                        htmlFor="user-name"
                        className="block text-sm text-gray-900 font-bold"
                    >
                        이름
                    </label>
                    <input
                        type="text"
                        id="user-name"
                        className="block w-full p-2.5 rounded-lg bg-gray-50 text-sm text-gray-900 border-2 focus:outline-none focus:border-main-300"
                        placeholder="이름을 입력해주세요"
                        onChange={handleUsernameValidation}
                        required
                    />
                    {name.length === 0 ? (
                        <span className='text-red-600 text-sm'>이름을 입력해 주세요.</span>
                    ) : (
                        <span className='text-green-500 text-sm'>✓</span>
                    )}
                </div>
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
                        onChange={handleEmailValidation}
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
                <div className='w-full flex flex-col gap-2'>
                    <label
                        htmlFor="company-name"
                        className="block text-sm text-gray-900 font-bold"
                    >
                        회사명
                    </label>
                    <input
                        type="text"
                        id="company-name"
                        className="block w-full p-2.5 rounded-lg bg-gray-50 text-sm text-gray-900 border-2 focus:outline-none focus:border-main-300"
                        placeholder="회사명을 입력해주세요"
                        onChange={handleCompanyNameValidation}
                        required
                    />
                    {companyName.length === 0 ? (
                        <span className='text-red-600 text-sm'>회사명을 입력해 주세요.</span>
                    ) : (
                        <span className='text-green-500 text-sm'>✓</span>
                    )}
                </div>
                <div className='relative w-full flex flex-col gap-2'>
                    <label
                        htmlFor="password"
                        className="block text-sm text-gray-900 font-bold"
                    >
                        비밀번호
                    </label>
                    <input
                        type={isPasswordVisible ? 'text' : 'password'}
                        id="password"
                        className="w-full rounded-lg bg-gray-50 p-2.5 text-sm text-gray-900 border-2 focus:outline-none focus:border-main-300"
                        placeholder="비밀번호를 입력해주세요"
                        onChange={handlePasswordValidation}
                        required
                    />
                    <button className='absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer hover:opacity-60 transition-all duration-200 ease-in-out'
                        onClick={handlePasswordVisibility}
                    >
                        <Image src={isPasswordVisible ? "/images/visibility_on.svg" : "/images/visibility_off.svg"} alt="비밀번호 보기 숨김" width={24} height={24} />
                    </button>
                    {passwordError || (password.length < 8) ? (
                        <span className='text-red-600 text-sm'>비밀번호가 8자 이상이 되도록 해 주세요.</span>
                    ) : (
                        <span className='text-green-500 text-sm'>✓</span>
                    )}
                </div>
                <div className='relative w-full flex flex-col gap-2'>
                    <label
                        htmlFor="password-check"
                        className="block text-sm text-gray-900 font-bold"
                    >
                        비밀번호 확인
                    </label>
                    <input
                        type={isPasswordCheckVisible ? 'text' : 'password'}
                        id="password-check"
                        className="w-full rounded-lg bg-gray-50 p-2.5 text-sm text-gray-900 border-2 focus:outline-none focus:border-main-300"
                        placeholder="비밀번호를 입력해주세요"
                        onChange={handlePasswordCheckValidation}
                        required
                    />
                    <button className='absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer hover:opacity-60 transition-all duration-200 ease-in-out'
                        onClick={handlePasswordCheckVisibility}
                    >
                        <Image src={isPasswordCheckVisible ? "/images/visibility_on.svg" : "/images/visibility_off.svg"} alt="비밀번호 보기 숨김" width={24} height={24} />
                    </button>
                    {password !== passwordCheck ? (
                        <span className='text-red-600 text-sm'>비밀번호가 아이디와 일치하지 않습니다.</span>
                    ) : (
                        <span className='text-green-400 text-sm'>✓</span>
                    )}
                </div>
                <button
                    type="submit"
                    className={`w-full rounded-lg ${emailError || passwordError || passwordCheckError ? 'bg-gray-400' : 'bg-main-300'} px-5 py-2.5 text-center text font-bold text-white cursor-pointer transition-all duration-300 ease-in-out`}
                >
                    확인
                </button>
                <p className='text-center text-sm text-gray-400'>
                    이미 계정이 있으신가요? <Link className="underline text-main-500" href="/signin">로그인</Link>
                </p>
            </form>
        </section>
    );
}

