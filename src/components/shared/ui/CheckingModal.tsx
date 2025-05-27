import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

export default function CheckingModal({ open, onClose, text, onConfirm }: { open: boolean, onClose: () => void, text: string, onConfirm?: () => void }) {
    const router = useRouter();

    if (!open) return null;

    const handleConfirm = () => {
        onClose();
        if (onConfirm) onConfirm();
        else router.push('/login');
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

