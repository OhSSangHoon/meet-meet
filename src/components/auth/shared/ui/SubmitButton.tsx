interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isSubmitting: boolean;
    isPasswordMatch?: boolean;
    text: string;
}

export default function SubmitButton({ isSubmitting, isPasswordMatch, text }: SubmitButtonProps) {
    return (
        <button
            type="submit"
            disabled={isSubmitting || !isPasswordMatch}
            className={`w-full rounded-lg ${isSubmitting || !isPasswordMatch ? 'bg-gray-400' : 'bg-main-300'} px-5 py-2.5 text-center text font-bold text-white cursor-pointer transition-all duration-300 ease-in-out`}
        >
            {text}
        </button>
    );
}