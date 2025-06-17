import Link from 'next/link';

interface AuthSwitchLinkProps {
    route: string;
    description: string;
    text: string;
}

/** 로그인 폼, 회원가입 폼 스위치 링크 */
export default function AuthSwitchLink({ route, description, text }: AuthSwitchLinkProps) {
    return (
        <p className='text-center text-sm text-gray-400'>
            {description} <Link className="underline text-main-400" href={route}>{text}</Link>
        </p>
    );
}