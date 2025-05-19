import Link from 'next/link';

interface FormFooterProps {
    route: string;
    description: string;
    text: string;
}

export default function FormFooter({ route, description, text }: FormFooterProps) {
    return (
        <p className='text-center text-sm text-gray-400'>
            {description} <Link className="underline text-main-500" href={route}>{text}</Link>
        </p>
    );
}

