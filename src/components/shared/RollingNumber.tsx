'use client';

import { useEffect, useState, useRef } from 'react';
import { m, useInView } from 'motion/react';

interface RollingNumberProps {
    value: number;
    duration?: number;
    interval?: number;
}

export default function RollingNumber({
    value,
    duration = 1500,
    interval = 100,
}: RollingNumberProps) {
    const [display, setDisplay] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.5 });

    useEffect(() => {
        if (!inView) return;
        const start = Date.now();
        let timer: NodeJS.Timeout;

        function roll() {
            if (Date.now() - start < duration) {
                setDisplay(Math.floor(Math.random() * (value + 10)));
                timer = setTimeout(roll, interval);
            } else setDisplay(value);
        }

        roll();

        return () => clearTimeout(timer);
    }, [value, duration, interval, inView]);

    return (
        <m.span
            ref={ref}
            className="font-semibold text-main-500"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
            viewport={{ once: true, amount: 1 }}
        >
            {display}
        </m.span>
    );
}