import Link from 'next/link';

interface FormFooterProps {
    route: string;
    description: string;
    text: string;
}

/** 로그인 폼, 회원가입 폼 Footer */
export default function FormFooter({ route, description, text }: FormFooterProps) {
    return (
        <p className='text-center text-sm text-gray-400'>
            {description} <Link className="underline text-main-400" href={route}>{text}</Link>
        </p>
    );
}

