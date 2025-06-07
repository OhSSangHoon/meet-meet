import Button from '@/components/shared/ui/Button';

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isSubmitting: boolean;
    text: string;
    isPasswordMatch?: boolean;
    props: {
        name?: string;
        email: string;
        companyName?: string;
        password: string;
    }
}

/** 로그인 폼, 회원가입 폼 Submit Button */
export default function SubmitButton({ isSubmitting, isPasswordMatch, text, props }: SubmitButtonProps) {
    return (
        <Button
            type="submit"
            disabled={isSubmitting || !isPasswordMatch || props?.name === '' || props?.email === '' || props?.companyName === '' || props?.password?.length < 8}
            text={text}
            customClassName={`w-full rounded-lg ${isSubmitting || !isPasswordMatch || props?.name === '' || props?.email === '' || props?.companyName === '' || props?.password?.length < 8 || !isPasswordMatch ? 'bg-button-disabled' : 'bg-button hover:bg-button-hover'} px-5 py-2.5 text-center text font-bold text-white cursor-pointer transition-all duration-300 ease-in-out`}
        />
    );
}