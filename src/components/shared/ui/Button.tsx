'use client';

import React from 'react';

type ButtonVariant = 'default' | 'cancel' | 'disabled';

interface ButtonProps {
    type?: 'button' | 'submit';
    text: string;
    variant?: ButtonVariant;
    disabled?: boolean;
    customClassName?: string;
    onClick?: () => void | Promise<void>;
}

export default function Button({
    type = 'button',
    text,
    variant = 'default',
    disabled = false,
    customClassName = '',
    onClick,
}: ButtonProps) {
    const getVariantClasses = (variant: ButtonVariant): string => {
        const baseClasses = 'px-4 py-2 rounded-lg font-semibold bg-button hover:bg-button-hover disabled:bg-gray-400 text-button-text cursor-pointer disabled:cursor-not-allowed transition duration-150 ease-in';
        switch (variant) {
            case 'default':
                return `${baseClasses}`;
            case 'cancel':
                return `bg-transparent text-main-500 border border-button hover:text-white ${baseClasses}`;
            case 'disabled':
                return `bg-gray-400 ${baseClasses}`;
            default:
                return `${baseClasses}`;
        }
    };

    const finalClassName = `${customClassName} ${getVariantClasses(variant)}`;
    const isClickDisabled = disabled || variant === 'disabled';

    return (
        <button
            type={type}
            disabled={isClickDisabled}
            onClick={onClick}
            className={finalClassName}
        >
            {text}
        </button>
    );
}
