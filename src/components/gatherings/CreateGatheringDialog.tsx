"use client"

import { useState, useRef, useEffect, useContext } from "react";
import { useCreateGathering } from '@/hooks/api/gatherings/useCreateGathering';
import { useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '@/providers/AuthProvider';
import { ConfirmDialogState, openConfirmDialog } from '@/components/shared/utils/confirmDialog';
import { formatDateToISO, DateTimeValue, dateTimeValueToDate, formatDateTimeValue } from '@/components/shared/utils/dateFormats';
import { validateCreateGathering, CreateGatheringFormSchemaType } from '@/components/gatherings/schema/createGatheringSchema';
import { XIcon } from "lucide-react";
import axios from 'axios';
import dynamic from 'next/dynamic';

const SelectionService = dynamic(() => import('@/components/gatherings/SelectionService'), { ssr: false });
const ConfirmDialog = dynamic(() => import('@/components/shared/ui/ConfirmDialog'), { ssr: false });
const DateTimePicker = dynamic(() => import('@/components/gatherings/DateTimePick'), { ssr: false });

interface CreateGatheringDialogProps {
    onClose: (shouldRefresh?: boolean) => void;
}

// 상수 선언 (스키마에 맞춰 정리)
const INITIAL_FORM_DATA = {
    name: '',
    location: '',
    capacity: 5,
    type: 'OFFICE_STRETCHING'
};

const LOCATION_OPTIONS = [
    { value: '', label: '장소를 선택해주세요' },
    { value: '을지로3가', label: '을지로3가' },
    { value: '건대입구', label: '건대입구' },
    { value: '신림', label: '신림' },
    { value: '홍대입구', label: '홍대입구' }
];

// 외부 함수들 (스키마와 연동)
const preventScrollAndShift = () => {
    const originalBodyOverFlow = document.body.style.overflow;
    const originalBodyPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
        document.body.style.overflow = originalBodyOverFlow;
        document.body.style.paddingRight = originalBodyPaddingRight;
    };
};

const handleAxiosError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const serverError = error?.response?.data?.error;
        return serverError?.message ?? '서버 처리 중 오류가 발생했습니다.';
    }

    if (error instanceof Error) {
        return error.message;
    }

    return '알 수 없는 에러가 발생했습니다';
};

const createApiFormData = (
    formData: typeof INITIAL_FORM_DATA,
    meetingDateTime: DateTimeValue | null,
    deadlineDateTime: DateTimeValue | null,
    imageFile: File | null
): FormData => {
    const apiFormData = new FormData();

    apiFormData.append('name', formData.name);
    apiFormData.append('location', formData.location);
    apiFormData.append('type', formData.type);
    apiFormData.append('capacity', formData.capacity.toString());

    if (meetingDateTime) {
        const finalGatheringDateTime = dateTimeValueToDate(meetingDateTime);
        apiFormData.append('dateTime', formatDateToISO(finalGatheringDateTime));
    }

    if (deadlineDateTime) {
        const finalDeadlineDateTime = dateTimeValueToDate(deadlineDateTime);
        apiFormData.append('registrationEnd', formatDateToISO(finalDeadlineDateTime));
    }

    if (imageFile) {
        apiFormData.append('image', imageFile);
    }

    return apiFormData;
};

export default function CreateGatheringDialog({ onClose }: CreateGatheringDialogProps) {
    const { token } = useContext(AuthContext);

    const queryClient = useQueryClient();

    // 상태 관리 (스키마 타입에 맞춰 정리)
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [fileName, setFileName] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [meetingDateTime, setMeetingDateTime] = useState<DateTimeValue | null>(null);
    const [deadlineDateTime, setDeadlineDateTime] = useState<DateTimeValue | null>(null);
    const [showGatheringPicker, setShowGatheringPicker] = useState(false);
    const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({ isOpen: false, text: '' });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const { createGathering } = useCreateGathering({
        token,
        onCallback: (message) => openConfirmDialog(setConfirmDialog, message),
    });

    // 모달 스크롤 방지 효과
    useEffect(() => {
        return preventScrollAndShift();
    }, []);

    // 이벤트 핸들러들
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: name === 'capacity'
                ? (isNaN(parseInt(value)) ? 5 : parseInt(value))
                : value
        }));
    };

    const handleServiceTypeSelect = (type: string) => {
        setFormData(prev => ({ ...prev, type }));
    };

    const handleFileButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (files?.length) {
            const file = files[0];
            setFileName(file.name);
            setImageFile(file);
            setError(null);
        }
    };

    const handleNormalClose = () => {
        onClose(false);
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 스키마에 정의된 타입에 맞춰 데이터 준비
        const formDataToValidate: CreateGatheringFormSchemaType = {
            name: formData.name,
            location: formData.location,
            capacity: formData.capacity,
            type: formData.type,
            meetingDateTime,
            deadlineDateTime,
            imageFile
        };

        // 스키마 통합 유효성 검증
        const validationResult = validateCreateGathering(formDataToValidate, token);

        if (!validationResult.success) {
            setError(validationResult.error ?? null);
            return;
        }

        setIsSubmitting(true);
        setError(null);

        // API용 FormData 생성
        const apiFormData = createApiFormData(formData, meetingDateTime, deadlineDateTime, imageFile);

        // 모임 생성 요청
        createGathering(apiFormData, {
            onSuccess: () => {
                openConfirmDialog(setConfirmDialog, '모임 생성 완료', async () => {
                    await queryClient.invalidateQueries({ queryKey: ['gatherings'] });
                    setIsSubmitting(false);
                    onClose(true);
                });
            },
            onError: (error: unknown) => {
                console.error('모임 생성 실패:', error);
                setIsSubmitting(false);

                const errorMessage = handleAxiosError(error);
                openConfirmDialog(setConfirmDialog, errorMessage);
            }
        });
    };

    return (
        <div className="dialog-background">
            <div className="relative w-full h-full flex items-center justify-center md:p-4">
                <div className="w-full max-w-2xl max-h-full flex flex-col">
                    <form
                        className="flex flex-col w-full h-full bg-white md:rounded-lg shadow-xl overflow-hidden"
                        onSubmit={handleSubmit}
                    >
                        {/* 헤더 */}
                        <header className="w-full h-[60px] bg-white md:rounded-t-lg flex flex-row justify-between items-center px-5 border-b border-gray-100 flex-shrink-0">
                            <h1 className="text-lg font-bold text-gray-800">모임 만들기</h1>
                            <button type="button" onClick={handleNormalClose} className='cursor-pointer'>
                                <XIcon className="w-7 h-7 text-gray-500" />
                            </button>
                        </header>

                        {/* 콘텐츠 영역 */}
                        <main className="flex-1 overflow-y-auto p-5">
                            {/* 에러 메시지 */}
                            {error && (
                                <div className="w-full mb-5 p-3 bg-red-100 text-red-600 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {/* 모임 이름 */}
                            <div className="w-full mb-5">
                                <h2 className="font-bold text-gray-800 mb-3">모임 이름</h2>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full h-[44px] rounded-lg bg-gray-50 py-2 px-4 text-semibold"
                                    placeholder="모임 이름을 입력해주세요"
                                />
                            </div>

                            {/* 장소 선택 */}
                            <div className="w-full mb-5">
                                <h2 className="font-bold text-gray-800 mb-3">장소</h2>
                                <select
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="w-full h-[44px] rounded-lg bg-gray-50 py-2 px-4 text-semibold appearance-none bg-[url('https://res.cloudinary.com/dbvzbdffi/image/upload/v1749717642/polygon_down_kqzif8.svg')] bg-[length:13px_13px] bg-[right_16px_center] bg-no-repeat"
                                >
                                    {LOCATION_OPTIONS.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 이미지 첨부 */}
                            <div className="w-full mb-5">
                                <h2 className="font-bold text-gray-800 mb-3">이미지</h2>
                                <div className="w-full flex flex-row items-center gap-5">
                                    <input
                                        type="text"
                                        className="w-full h-[44px] rounded-lg bg-gray-50 py-2 px-4 text-semibold"
                                        placeholder="이미지를 첨부해주세요"
                                        value={fileName}
                                        readOnly
                                    />
                                    <div
                                        className="w-[100px] h-[44px] border-2 border-main-500 text-main-500 font-semibold text-sm px-2 rounded-lg flex flex-row items-center justify-center cursor-pointer hover:bg-main-50 whitespace-nowrap"
                                        onClick={handleFileButtonClick}
                                    >
                                        <p className="text-base">파일 추가</p>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                    />
                                </div>
                            </div>

                            {/* 서비스 선택 */}
                            <SelectionService
                                selectedType={formData.type}
                                onSelect={handleServiceTypeSelect}
                            />

                            {/* 날짜/시간 선택 */}
                            <div className="flex flex-col md:flex-row gap-5 mb-5">
                                <div className="flex-1">
                                    <h2 className="font-bold text-gray-800 mb-3">모임 일정</h2>
                                    <input
                                        type="text"
                                        value={formatDateTimeValue(meetingDateTime)}
                                        onClick={() => setShowGatheringPicker(true)}
                                        readOnly
                                        className="w-full h-[44px] rounded-lg bg-gray-50 py-2 px-4 text-semibold cursor-pointer"
                                        placeholder="날짜와 시간을 선택해주세요"
                                    />
                                </div>

                                <div className="flex-1">
                                    <h2 className="font-bold text-gray-800 mb-3">마감 일정</h2>
                                    <input
                                        type="text"
                                        value={formatDateTimeValue(deadlineDateTime)}
                                        onClick={() => setShowDeadlinePicker(true)}
                                        readOnly
                                        className="w-full h-[44px] rounded-lg bg-gray-50 py-2 px-4 text-semibold cursor-pointer"
                                        placeholder="날짜와 시간을 선택해주세요"
                                    />
                                </div>
                            </div>

                            {/* 모집정원 */}
                            <div className="w-full mb-5">
                                <h2 className="font-bold text-gray-800 mb-3">모집 정원</h2>
                                <input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleInputChange}
                                    min="5"
                                    max="20"
                                    className="w-full h-[44px] rounded-lg bg-gray-50 py-2 px-4 text-semibold"
                                    placeholder="최소 5인 이상 입력해주세요."
                                />
                            </div>
                        </main>

                        {/* 제출 버튼 */}
                        <footer className="w-full p-5 bg-white md:rounded-b-lg flex-shrink-0">
                            <button
                                type="submit"
                                className="w-full bg-main-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-main-600 cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? '처리 중...' : '확인'}
                            </button>
                        </footer>
                    </form>
                </div>
            </div>

            {/* 확인 다이얼로그 */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                text={confirmDialog.text}
                onClose={() => setConfirmDialog({ isOpen: false, text: '' })}
                onConfirm={confirmDialog.onConfirm}
            />

            {/* 모임 일정 선택 모달 */}
            {showGatheringPicker && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowGatheringPicker(false)}></div>
                    <div className="relative bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">모임 일정 선택</h2>
                            <button onClick={() => setShowGatheringPicker(false)}>
                                <XIcon className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>
                        <DateTimePicker
                            value={meetingDateTime}
                            onChange={setMeetingDateTime}
                            label=""
                        />
                    </div>
                </div>
            )}

            {/* 마감 일정 선택 모달 */}
            {showDeadlinePicker && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowDeadlinePicker(false)}></div>
                    <div className="relative bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">마감 일정 선택</h2>
                            <button onClick={() => setShowDeadlinePicker(false)}>
                                <XIcon className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>
                        <DateTimePicker
                            value={deadlineDateTime}
                            onChange={setDeadlineDateTime}
                            label=""
                        />
                    </div>
                </div>
            )}
        </div>
    );
}