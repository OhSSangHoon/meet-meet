import { AuthContext } from '@/providers/AuthProvider';
import { useContext, useEffect, useState } from 'react';

const TOKEN_EXPIRE_MS = 1000 * 60 * 60;

export default function TokenCountdown() {
    const { token, signOut } = useContext(AuthContext);

    const [remaining, setRemaining] = useState(TOKEN_EXPIRE_MS);

    useEffect(() => {
        if (!token) return;

        const issuedAt = Number(localStorage.getItem('token_issued_at') || Date.now());
        const update = () => {
            const now = Date.now();
            const diff = TOKEN_EXPIRE_MS - (now - issuedAt);
            setRemaining(diff > 0 ? diff : 0);
            if (diff <= 0) signOut();
        };
        update();
        const timer = setInterval(update, 1000);
        return () => clearInterval(timer);
    });

    const minutes = String(Math.floor(remaining / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0');

    return <span className='hidden md:block font-medium text-sm dark:text-white'>{minutes}:{seconds}</span>;
}