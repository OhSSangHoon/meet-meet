"use client"

import { useState, useRef, useEffect, useContext } from "react";
import { useCreateGathering } from '@/hooks/api/gatherings/useCreateGathering';
import { useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '@/providers/AuthProvider';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ConfirmDialogState, openConfirmDialog } from '@/utils/shared/confirmDialog';
import { excapeForXSS } from '@/utils/shared/excapeForXSS';
import { formatDateToISO, DateTimeValue, dateTimeValueToDate, formatDateTimeValue } from '@/utils/shared/date';
import { CreateGatheringFormSchemaType, createGatheringFormSchema } from '@/utils/gatherings/createGatheringSchema';
import { gatheringsQuery } from '@/queries/gatherings.query';
import { X } from "lucide-react";
import axios, { AxiosError } from 'axios';
import dynamic from 'next/dynamic';
import SelectionService from '@/components/gatherings/SelectionService';
import InputField from '@/components/auth/InputField';

const ConfirmDialog = dynamic(() => import('@/components/shared/ConfirmDialog'), { ssr: false });
const DateTimePicker = dynamic(() => import('@/components/gatherings/DateTimePicker'), { ssr: false });

interface CreateGatheringDialogProps {
    onClose: (shouldRefresh?: boolean) => void;
}

/** 장소 스키마 */
const LOCATION_OPTIONS = [
    { value: '', label: '장소를 선택해주세요' },
    { value: '을지로3가', label: '을지로3가' },
    { value: '건대입구', label: '건대입구' },
    { value: '신림', label: '신림' },
    { value: '홍대입구', label: '홍대입구' }
];

/** 스크롤 방지 함수 */
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

/** 에러 메시지 핸들링 함수 */
const handleAxiosError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const serverError = error?.response?.data?.error;
        return serverError?.message ?? '서버 처리 중 오류가 발생했습니다';
    }

    if (error instanceof Error) return error.message;

    return '알 수 없는 에러가 발생했습니다';
};

export default function CreateGatheringDialog({ onClose }: CreateGatheringDialogProps) {
    const { token } = useContext(AuthContext);
    const queryClient = useQueryClient();

    // 📌 React Hook Form으로 모든 상태 통합 관리
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
        formState: { errors },
        reset,
        trigger,
    } = useForm<CreateGatheringFormSchemaType>({
        resolver: zodResolver(createGatheringFormSchema),
        defaultValues: {
            name: '',
            location: '',
            capacity: 5,
            type: 'OFFICE_STRETCHING',
            meetingDateTime: null,
            deadlineDateTime: null,
            imageFile: null,
        },
    });

    // 📌 watch로 폼 값들 관찰
    const watchedValues = watch();
    const meetingDateTime = watch('meetingDateTime');
    const deadlineDateTime = watch('deadlineDateTime');

    // 📌 UI 상태만 별도 관리
    const [fileName, setFileName] = useState("");
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

    useEffect(() => {
        return preventScrollAndShift();
    }, []);

    // 📌 서비스 타입 선택 핸들러 - Hook Form과 연동
    const handleServiceTypeSelect = (type: string) => {
        setValue('type', type as string);
        trigger('type'); // 유효성 검사 트리거
    };

    // 📌 파일 첨부 핸들러 - Hook Form과 연동
    const handleFileButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files?.length) {
            const file = files[0];
            setFileName(file.name);
            setValue('imageFile', file); // Hook Form에 등록
            trigger('imageFile'); // 유효성 검사 트리거
            setError(null);
        }
    };

    // 📌 날짜 변경 핸들러들 - Hook Form과 연동
    const handleMeetingDateTimeChange = (dateTime: DateTimeValue | null) => {
        setValue('meetingDateTime', dateTime);
        trigger('meetingDateTime');
    };

    const handleDeadlineDateTimeChange = (dateTime: DateTimeValue | null) => {
        setValue('deadlineDateTime', dateTime);
        trigger('deadlineDateTime');
    };

    const handleNormalClose = () => onClose(false);

    // 📍 API용 FormData 생성 함수
    const createApiFormData = (data: CreateGatheringFormSchemaType): FormData => {
        const apiFormData = new FormData();

        apiFormData.append('name', excapeForXSS(data.name));
        apiFormData.append('location', excapeForXSS(data.location));
        apiFormData.append('type', excapeForXSS(data.type));
        apiFormData.append('capacity', excapeForXSS(data.capacity.toString()));

        if (data.meetingDateTime) {
            const finalGatheringDateTime = dateTimeValueToDate(data.meetingDateTime);
            apiFormData.append('dateTime', formatDateToISO(finalGatheringDateTime));
        }

        if (data.deadlineDateTime) {
            const finalDeadlineDateTime = dateTimeValueToDate(data.deadlineDateTime);
            apiFormData.append('registrationEnd', formatDateToISO(finalDeadlineDateTime));
        }

        if (data.imageFile) {
            apiFormData.append('image', data.imageFile);
        }

        return apiFormData;
    };

    // 📌 폼 제출 핸들러
    const onSubmit = async (data: CreateGatheringFormSchemaType) => {
        if (!token) {
            setError('로그인이 필요합니다');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const apiFormData = createApiFormData(data);

            await createGathering(apiFormData, {
                onSuccess: async () => {
                    await queryClient.invalidateQueries({ queryKey: gatheringsQuery.all() });
                    openConfirmDialog(setConfirmDialog, '모임 생성 완료', () => {
                        setIsSubmitting(false);
                        onClose(true);
                        reset();
                        setFileName("");
                    });
                },
                onError: (error: unknown) => {
                    setIsSubmitting(false);
                    const errorMessage = handleAxiosError(error);
                    openConfirmDialog(setConfirmDialog, errorMessage);
                }
            });
        } catch (error) {
            console.error('모임 생성 실패:', error);
            setIsSubmitting(false);
            setError('예상치 못한 오류가 발생했습니다');
        }
    };

    // 📍 폼 제출 에러 핸들러
    const onError = (errors: unknown) => {
        // 첫 번째 에러 메시지 표시
        const firstError = Object.values(errors as Record<string, unknown>)[0] as AxiosError;
        if (firstError?.message) setError(firstError.message);
    };

    return (
        <div className="dialog-background text-gray-900">
            <div className="relative w-full h-full flex items-center justify-center md:p-4">
                <div className="w-full max-w-2xl max-h-full flex flex-col">
                    <form
                        className="flex flex-col w-full h-full bg-white dark:bg-dark-2 md:rounded-lg shadow-xl overflow-hidden"
                        onSubmit={handleSubmit(onSubmit, onError)}
                    >
                        {/* 헤더 */}
                        <header className="w-full h-[60px] bg-white dark:bg-dark-2 md:rounded-t-lg flex flex-row justify-between items-center px-5 border-b border-gray-100 flex-shrink-0">
                            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">모임 만들기</h1>
                            <button type="button" onClick={handleNormalClose} className='cursor-pointer'>
                                <X className="w-7 h-7 text-gray-500 dark:text-gray-200" />
                            </button>
                        </header>

                        {/* 콘텐츠 영역 */}
                        <main className="overflow-y-auto p-5 flex-1 flex flex-col gap-5">
                            {/* 에러 메시지 */}
                            {error && (
                                <div className="w-full mb-5 p-3 bg-red-100 text-red-600 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {/* 모임 이름 */}
                            <div className="w-full">
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <InputField
                                            label="모임 이름"
                                            labelSize="text-base"
                                            {...field}
                                            placeholder="모임 이름을 입력해주세요"
                                            disabled={false}
                                            errorResponseMessage={errors.name?.message}
                                        />
                                    )}
                                />
                            </div>

                            {/* 장소 선택 */}
                            <div className="w-full flex flex-col gap-2">
                                <label htmlFor="location" className="text-base font-bold text-gray-800 dark:text-gray-200">장소</label>
                                <select
                                    id="location"
                                    {...register('location')}
                                    className="w-full h-[44px] rounded-lg cursor-pointer bg-gray-50 py-2 px-4 text-semibold appearance-none bg-[url('https://res.cloudinary.com/dbvzbdffi/image/upload/v1749717642/polygon_down_kqzif8.svg')] bg-[length:13px_13px] bg-[right_16px_center] bg-no-repeat"
                                >
                                    {LOCATION_OPTIONS.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.location && (
                                    <span className="text-red-500 text-sm">{errors.location.message}</span>
                                )}
                            </div>

                            {/* 이미지 첨부 */}
                            <div className="w-full">
                                <div className="w-full flex items-end gap-5">
                                    <InputField
                                        type="text"
                                        label="이미지"
                                        labelSize="text-base"
                                        placeholder="이미지를 첨부해주세요"
                                        value={fileName}
                                        disabled={false}
                                        readOnly
                                    />
                                    <div
                                        className="w-[100px] h-[47px] border-2 border-main-500 text-main-500 font-semibold text-sm px-2 rounded-lg flex flex-row items-center justify-center cursor-pointer hover:bg-main-50 whitespace-nowrap transition-gathering-item"
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
                                {errors.imageFile && (
                                    <span className="text-red-500 text-sm">{errors.imageFile.message}</span>
                                )}
                            </div>

                            {/* 서비스 선택 */}
                            <div className="w-full">
                                <SelectionService
                                    selectedType={watchedValues.type}
                                    onSelect={handleServiceTypeSelect}
                                />
                                {errors.type && (
                                    <span className="text-red-500 text-sm">{errors.type.message}</span>
                                )}
                            </div>

                            {/* 날짜/시간 선택 */}
                            <div className="flex flex-col md:flex-row gap-5">
                                <div className="flex-1 flex flex-col gap-2">
                                    <label htmlFor="meetingDateTime" className="font-bold dark:text-white">모임 일정</label>
                                    <input
                                        id="meetingDateTime"
                                        type="text"
                                        value={formatDateTimeValue(meetingDateTime)}
                                        onClick={() => setShowGatheringPicker(true)}
                                        readOnly
                                        className="w-full h-[44px] rounded-lg bg-gray-50 py-2 px-4 text-semibold cursor-pointer"
                                        placeholder="날짜와 시간을 선택해주세요"
                                    />
                                    {errors.meetingDateTime && (
                                        <span className="text-red-500 text-sm">{errors.meetingDateTime.message}</span>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col gap-2">
                                    <label htmlFor="deadlineDateTime" className="font-bold dark:text-white">마감 일정</label>
                                    <input
                                        id="deadlineDateTime"
                                        type="text"
                                        value={formatDateTimeValue(deadlineDateTime)}
                                        onClick={() => setShowDeadlinePicker(true)}
                                        readOnly
                                        className="w-full h-[44px] rounded-lg bg-gray-50 py-2 px-4 text-semibold cursor-pointer"
                                        placeholder="날짜와 시간을 선택해주세요"
                                    />
                                    {errors.deadlineDateTime && (
                                        <span className="text-red-500 text-sm">{errors.deadlineDateTime.message}</span>
                                    )}
                                </div>
                            </div>

                            {/* 모집정원 */}
                            <div className="w-full flex flex-col gap-2">
                                <label htmlFor="capacity" className="font-bold text-gray-800 dark:text-gray-200">모집 정원</label>
                                <Controller
                                    name="capacity"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            id="capacity"
                                            type="number"
                                            {...field}
                                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                                            min="5"
                                            max="20"
                                            className="w-full h-[44px] rounded-lg bg-gray-50 py-2 px-4 text-semibold"
                                            placeholder="최소 5인 이상 입력해주세요."
                                        />
                                    )}
                                />
                                {errors.capacity && (
                                    <span className="text-red-500 text-sm">{errors.capacity.message}</span>
                                )}
                            </div>
                        </main>

                        {/* 제출 버튼 */}
                        <footer className="w-full p-5 bg-white dark:bg-dark-2 md:rounded-b-lg flex-shrink-0">
                            <button
                                type="submit"
                                className="w-full bg-main-500 text-white text-lg font-semibold py-3 px-6 rounded-lg hover:bg-main-600 cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed transition-gathering-item"
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
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowGatheringPicker(false);
                        }}
                    ></div>
                    <div
                        className="relative bg-white rounded-lg p-6 max-w-md w-full"
                        onClick={(e) => e.stopPropagation()} // 📌 모달 내부 클릭 시 이벤트 버블링 방지
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">모임 일정 선택</h2>
                            <button
                                type="button"
                                className='cursor-pointer'
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowGatheringPicker(false);
                                }}
                            >
                                <X className="size-6 text-gray-500" />
                            </button>
                        </div>
                        <DateTimePicker
                            value={meetingDateTime}
                            onChange={handleMeetingDateTimeChange}
                            label=""
                        />
                    </div>
                </div>
            )}

            {/* 마감 일정 선택 모달 */}
            {showDeadlinePicker && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowDeadlinePicker(false);
                        }}
                    ></div>
                    <div
                        className="relative bg-white rounded-lg p-6 max-w-md w-full"
                        onClick={(e) => e.stopPropagation()} // 📌 모달 내부 클릭 시 이벤트 버블링 방지
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">마감 일정 선택</h2>
                            <button
                                type="button"
                                className='cursor-pointer'
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowDeadlinePicker(false);
                                }}
                            >
                                <X className="size-6 text-gray-500" />
                            </button>
                        </div>
                        <DateTimePicker
                            value={deadlineDateTime}
                            onChange={handleDeadlineDateTimeChange}
                            label=""
                        />
                    </div>
                </div>
            )}
        </div>
    );
}