'use client';

import { X } from 'lucide-react';

interface CheckingModalProps {
    isOpen: boolean;
    text: string;
    onClose: () => void;
    onConfirm?: () => void;
    onCallback?: () => void;
}

/**
 * 프로젝트 공통 다이얼로그
 * @param isOpen 다이얼로그 열기 여부
 * @param text 다이얼로그에 표시할 텍스트
 * @param onClose 닫기 함수
 * @param onConfirm 확인 함수
 * @param onCallback 전달받을 콜백 함수
 * @returns 팝업
 */
export default function ConfirmDialog({ isOpen, text, onClose, onConfirm, onCallback }: CheckingModalProps) {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onClose();
        if (onConfirm) onConfirm();
        if (onCallback) onCallback();
    };

    return (
        <div className="fixed inset-0 z-50 px-4 sm:px-0 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 sm:w-100 flex flex-col gap-4">
                <div className='flex justify-between items-center'>
                    <span className="text-lg font-semibold">{text}</span>
                    <button
                        onClick={onClose}
                        className='cursor-pointer hover:opacity-60 hover:text-button transition'
                    >
                        <X className='w-6 h-6' />
                    </button>
                </div>
                <button
                    className="px-6 py-2 bg-main-500 text-white rounded-md cursor-pointer hover:bg-main-600 transition"
                    onClick={handleConfirm}
                >
                    확인
                </button>
            </div>
        </div>
    );
}

