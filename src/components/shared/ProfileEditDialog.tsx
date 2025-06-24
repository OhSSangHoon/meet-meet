'use client';

import { useContext, useRef, useState } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { escapeForXSS } from '@/utils/shared/escapeForXSS';
import { ConfirmDialogState, openConfirmDialog } from '@/utils/shared/confirmDialog';
import { Upload } from 'lucide-react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Button from '@/components/shared/Button';

const ConfirmDialog = dynamic(() => import('@/components/shared/ConfirmDialog'), { ssr: false });

const profileEditFormSchema = z.object({
    companyName: z.string().min(1),
})

type ProfileEditFormSchemaType = z.infer<typeof profileEditFormSchema>;

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

/** 프로필 수정 다이얼로그 */
export default function ProfileEditDialog({ setIsProfileEditDialogOpen }: { setIsProfileEditDialogOpen: (open: boolean) => void }) {
    const { token, userCompanyName, updateUserProfile } = useContext(AuthContext);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({ isOpen: false, text: '' });

    const { register, handleSubmit } = useForm<ProfileEditFormSchemaType>({
        resolver: zodResolver(profileEditFormSchema),
        defaultValues: {
            companyName: userCompanyName,
        },
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const router = useRouter();
    const pathname = usePathname();

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

    const onSubmit = async (data: ProfileEditFormSchemaType) => {
        if (!imageFile) {
            setError("이미지를 첨부해주세요.");
            return;
        }

        try {
            const response = await editProfile(imageFile, escapeForXSS(data.companyName), token!);
            if (response.status === 200) {
                updateUserProfile(response.data);
                setError(null);
                setImageFile(null);
                openConfirmDialog(setConfirmDialog, '프로필 수정 완료', () => setIsProfileEditDialogOpen(false));
                if (pathname === '/auth/profile') router.replace('/');
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
        setError(null);
    }

    const handleExit = () => router.replace('/');

    return (
        <dialog
            open
            className="dialog-background w-full h-full"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    if (pathname === '/auth/profile') handleExit();
                    else handleCancel();
                }
            }}
        >
            <h1 className='text-2xl font-semibold text-white'>PROFILE EDIT</h1>
            <form
                className="w-full max-w-md p-6 rounded-md bg-white dark:bg-dark-2 shadow-md flex flex-col gap-4"
                onSubmit={handleSubmit(onSubmit)}
                aria-labelledby="profile-edit-title"
            >
                <h2 id="profile-edit-title" className="sr-only">프로필 수정</h2>
                <div className="grid grid-cols-3 items-center gap-y-6 gap-x-4 w-full mb-2">
                    <label htmlFor="profile-image" className="col-span-1 text-left text-global-text dark:text-white font-semibold">IMAGE (1:1)</label>
                    <div className="col-span-2 flex items-center gap-4">
                        <Button
                            variant='cancel'
                            onClick={handleFileClick}
                            customClassName='size-16'
                            aria-label="프로필 이미지 업로드"
                        >
                            <Upload className='size-full' />
                        </Button>
                        <input
                            type="file"
                            id="profile-image"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileChange}
                            accept="image/*"
                            aria-label="프로필 이미지 선택"
                        />
                        <span>{imageFile?.name}</span>
                    </div>
                    <label htmlFor="company-name" className="col-span-1 text-left font-semibold">COMPANY</label>
                    <input
                        type="text"
                        id="company-name"
                        {...register('companyName')}
                        className="col-span-2 w-full border-2 border-gray-300 rounded-lg p-2"
                        aria-label="회사명 입력"
                    />
                </div>
                {error && <p role="alert" className="text-red-500 text-sm">{error}</p>}
                <div className='flex gap-4'>
                    <Button
                        variant='default'
                        text={pathname === '/auth/profile' ? '다음에 변경' : '취소'}
                        onClick={pathname === '/auth/profile' ? handleExit : handleCancel}
                        customClassName='w-full padding-button hover-button rounded-lg bg-button-categories text-button-text font-semibold'
                    />
                    <Button
                        variant='default'
                        text='수정하기'
                        type='submit'
                        customClassName='w-full padding-button hover-button rounded-lg bg-button text-button-text font-semibold'
                    />
                </div>
            </form>

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                text={'프로필을 수정했습니다'}
                onClose={() => setConfirmDialog({ isOpen: false, text: '' })}
                onConfirm={confirmDialog.onConfirm}
            />
        </dialog>
    );
}