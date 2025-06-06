'use client';

import { useContext, useRef, useState } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { ConfirmDialogState, openConfirmDialog } from '../shared/utils/confirmDialog';
import axios from 'axios';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const ConfirmDialog = dynamic(() => import('@/components/shared/ui/ConfirmDialog'), { ssr: false });

const editProfile = async (imageFile: File | null, companyName: string, token: string) => {
    try {
        const formData = new FormData();
        formData.append('companyName', companyName);
        if (imageFile) formData.append('image', imageFile);

        const response = await axios.put('/api/auth/user', formData, { headers: { Authorization: `Bearer ${token}` } });
        return response;
    } catch (error) {
        console.error('Profile edit error:', error);
        throw error;
    }
};

/** 마이페이지 프로필 수정 다이얼로그 */
export default function ProfileEditDialog({ setIsProfileEditDialogOpen }: { setIsProfileEditDialogOpen: (open: boolean) => void }) {
    const { token, updateUserProfile } = useContext(AuthContext);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [companyName, setCompanyName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({ isOpen: false, text: '' });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (files && files.length > 0) {
            const file = files[0];

            if (file.size > 75 * 1024) {
                setError("이미지 파일 크기가 너무 큽니다. 75KB 이하로 첨부해주세요.");
                return;
            }

            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/avif', 'image/webp'];

            if (!allowedTypes.includes(file.type)) {
                setError("이미지 파일 타입이 맞지않습니다. jpg, png, gif, svg, avif, webp 파일만 가능합니다.");
                return;
            }

            setImageFile(file);
            setError(null);
        }
    };

    const handleFileClick = () => fileInputRef.current?.click();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!imageFile) {
            setError("이미지를 첨부해주세요.");
            return;
        }

        try {
            const response = await editProfile(imageFile, companyName, token!);
            if (response.status === 200) {
                updateUserProfile(response.data);
                setError(null);
                setImageFile(null);
                setCompanyName('');
                openConfirmDialog(setConfirmDialog, '프로필 수정 완료', () => setIsProfileEditDialogOpen(false));
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const serverError = error?.response?.data?.error;
                if (serverError?.status === 413) setError("이미지 파일 크기가 너무 큽니다. 5MB 이하로 첨부해주세요.");
                else openConfirmDialog(setConfirmDialog, serverError?.message);
            }
        }
    }

    const handleCancel = () => {
        setIsProfileEditDialogOpen(false);
        setImageFile(null);
        setCompanyName('');
        setError(null);
    }

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-2 bg-black/50">
            <h1 className='text-2xl font-semibold text-white'>PROFILE EDIT</h1>
            <form
                className="w-full max-w-md p-6 rounded-md bg-white shadow-md flex flex-col gap-4"
                onSubmit={handleSubmit}>
                <div className="grid grid-cols-3 items-center gap-y-6 gap-x-4 w-full mb-2">
                    <label className="col-span-1 text-left font-semibold">IMAGE</label>
                    <div className="col-span-2 flex items-center gap-4">
                        <button
                            type="button"
                            className="w-10 h-10 cursor-pointer"
                            onClick={handleFileClick}
                        >
                            <Image
                                src="/icons/default_profile_image.svg"
                                alt="프로필 수정"
                                width={36}
                                height={36}
                                className='w-full h-full pointer-events-none object-cover rounded-full'
                            />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                    </div>
                    <label className="col-span-1 text-left font-semibold">COMPANY</label>
                    <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="col-span-2 w-full border-2 border-gray-300 rounded-lg p-2"
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className='flex gap-4'>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="w-full padding-button hover-button rounded-lg bg-button-categories text-button-text font-semibold">
                        취소
                    </button>
                    <button type="submit"
                        className="w-full padding-button hover-button rounded-lg bg-button  text-button-text font-semibold">
                        수정하기
                    </button>
                </div>
            </form>
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                text={'프로필을 수정했습니다'}
                onClose={() => setConfirmDialog({ isOpen: false, text: '' })}
                onConfirm={confirmDialog.onConfirm}
            />
        </div>
    );
}