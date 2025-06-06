import React from 'react';
import Image from 'next/image';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    disabled: boolean;
    isError?: string;
    errorResponseMessage?: string | null;
    isPasswordVisible?: boolean;
    handlePasswordVisibility?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/** 로그인 폼, 회원가입 폼 Input Field */
const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
    ({ label, id, type, placeholder, isError, errorResponseMessage, disabled, isPasswordVisible, handlePasswordVisibility, ...props }, ref) => (
        <div className="w-full flex flex-col gap-2">
            <label htmlFor={id} className="block text-sm text-gray-900 font-bold">{label}</label>
            <div className='relative'>
                <input
                    ref={ref}
                    type={label === '비밀번호' ? (isPasswordVisible ? 'text' : 'password') : type}
                    id={id}
                    placeholder={placeholder}
                    aria-invalid={disabled ? (isError ? 'true' : 'false') : undefined}
                    className={`block w-full p-2.5 rounded-lg bg-gray-50 text-sm text-gray-900 border-2 focus:outline-none ${isError || errorResponseMessage ? 'border-red-600' : 'focus:border-main-300'}`}
                    {...props}
                />
                {label === '비밀번호' && (
                    <button
                        type="button"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer hover:opacity-60"
                        onClick={handlePasswordVisibility}
                        tabIndex={-1}
                    >
                        <Image
                            src={isPasswordVisible ? "/icons/visibility_on.svg" : "/icons/visibility_off.svg"}
                            alt="비밀번호 보기 숨김"
                            width={24}
                            height={24}
                        />
                    </button>
                )}
            </div>
            {errorResponseMessage ? (
                <p className='text-red-600 text-sm'>{errorResponseMessage}</p>
            ) :
                (isError && <p className='text-red-600 text-sm'>{isError}</p>)
            }
        </div>
    )
);

InputField.displayName = 'InputField';

export default InputField;