"use client"

import { AuthContext } from '@/providers/AuthProvider';
import { useState, useRef, useEffect, useContext } from "react";
import { useCreateGathering } from '@/hooks/api/useCreateGathering';
import { ConfirmDialogState, openConfirmDialog } from '@/components/shared/utils/confirmDialog';
import { XIcon } from "lucide-react";
import axios from 'axios';
import dynamic from 'next/dynamic';
import SelectionService from "./SelectionService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ConfirmDialog = dynamic(() => import('@/components/shared/ui/ConfirmDialog'), { ssr: false });

export default function CreateGatheringDialog({ onClose }: { onClose: () => void }) {
    const { token } = useContext(AuthContext);

    // 폼 데이터 상태 관리
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        capacity: 5,
        type: 'OFFICE_STRETCHING' // 기본값 설정
    });

    // 파일명 상태
    const [fileName, setFileName] = useState("");

    // 파일 입력 요소에 접근하기 위한 ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 이미지 파일
    const [imageFile, setImageFile] = useState<File | null>(null);

    // 모임 날짜
    const [meetingDate, setMeetingDate] = useState<Date | null>(null);

    // 마감 날짜
    const [deadlineDate, setDeadlineDate] = useState<Date | null>(null);

    // 에러 상태 관리
    const [error, setError] = useState<string | null>(null);

    // 제출 상태 관리 (기존 방식 유지)
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 모임 생성 완료/실패 모달
    const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({ open: false, text: '' });

    const { createGathering } = useCreateGathering({
        token,
        onCallback: (message) => openConfirmDialog(setConfirmDialog, message),
    });

    // 입력 필드 변경 핸들러
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 서비스 타입 선택 핸들러
    const handleServiceTypeSelect = (type: string) => {
        setFormData(prev => ({
            ...prev,
            type
        }));
    };


    // 모달이 열릴 때 스크롤 방지 및 레이아웃 시프트 방지
    useEffect(() => {
        const originalBodyOverFlow = document.body.style.overflow;
        const originalBodyPaddingRight = document.body.style.paddingRight;

        // 스크롤바 너비 계산
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        // 스크롤 방지 및 스크롤바 공간 보상
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollbarWidth}px`;

        return () => {
            document.body.style.overflow = originalBodyOverFlow;
            document.body.style.paddingRight = originalBodyPaddingRight;
        };
    }, []);

    // 파일 추가 버튼 클릭 핸들러
    const handleFileButtonClick = () => {
        fileInputRef.current?.click();
    };

    // 파일 선택 핸들러
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (files && files.length > 0) {
            const file = files[0];

            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                setError("이미지 파일 크기가 너무 큽니다. 5MB 이하로 첨부해주세요.");
                return;
            }

            // 이미지 타입 검증
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/avif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                setError("이미지 파일 타입이 맞지않습니다. jpg, png, gif, svg, avif, webp 파일만 가능합니다.");
                return;
            }

            setFileName(file.name);
            setImageFile(file);
            setError(null);
        }
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 토큰 체크
        if (!token) {
            setError('로그인이 필요한 서비스입니다.');
            return;
        }

        // 필수 필드 검증
        if (!formData.name || !formData.location || !meetingDate) {
            setError("모든 필수 항목을 입력해주세요.");
            return;
        }

        if (!imageFile) {
            setError("이미지를 첨부해주세요.");
            return;
        }

        if (formData.capacity < 5) {
            setError("모집 정원은 최소 5명 이상이어야 합니다.");
            return;
        }

        // 마감일이 모임일 이후인지 확인
        if (deadlineDate && meetingDate && deadlineDate > meetingDate) {
            setError("마감 날짜는 모임 날짜 이전이어야 합니다.");
            return;
        }

        setIsSubmitting(true); // 로딩 시작
        setError(null);

        // FormData 객체 생성
        const apiFormData = new FormData();
        apiFormData.append('name', formData.name);
        apiFormData.append('location', formData.location);
        apiFormData.append('type', formData.type);
        apiFormData.append('capacity', formData.capacity.toString());

        // 날짜 포맷팅 (ISO 형식 YYYY-MM-DDTHH:MM:SS)
        if (meetingDate) {
            apiFormData.append('dateTime', meetingDate.toISOString());
        }

        if (deadlineDate) {
            apiFormData.append('registrationEnd', deadlineDate.toISOString());
        }

        // 이미지 파일 추가
        if (imageFile) {
            apiFormData.append('image', imageFile);
        }

        // 모임 생성 요청
        createGathering(apiFormData, {
            onSuccess: () => {
                openConfirmDialog(setConfirmDialog, '모임 생성 완료', () => {
                    setIsSubmitting(false);
                    onClose();
                });
            },
            onError: (error: unknown) => {
                console.error('모임 생성 실패:', error);
                setIsSubmitting(false);

                if (axios.isAxiosError(error)) {
                    const serverError = error?.response?.data?.error;
                    openConfirmDialog(setConfirmDialog, serverError?.message);
                } else if (error instanceof Error) {
                    openConfirmDialog(setConfirmDialog, error.message);
                } else {
                    openConfirmDialog(setConfirmDialog, '알 수 없는 에러가 발생했습니다');
                }
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50">
            {/* 배경 */}
            <div className="absolute inset-0 bg-black opacity-50"></div>

            {/* 모달 컨테이너 */}
            <div className="relative w-full h-full flex items-center justify-center md:p-4">
                <div className="w-full max-w-2xl max-h-full flex flex-col">
                    <form
                        className="flex flex-col w-full h-full bg-white md:rounded-lg shadow-xl overflow-hidden"
                        onSubmit={handleSubmit}
                    >
                        {/* 모임 만들기 타이틀*/}
                        <div className="w-full h-[60px] bg-white md:rounded-t-lg flex flex-row justify-between items-center px-5 border-b border-gray-100 flex-shrink-0">
                            <h1 className="text-lg font-bold text-gray-800">모임 만들기</h1>
                            <button type="button" onClick={onClose}>
                                <XIcon className="w-7 h-7 text-gray-500" />
                            </button>
                        </div>

                        {/* 콘텐츠 영역 */}
                        <div className="flex-1 overflow-y-auto p-5">
                            {/* 에러 메시지 */}
                            {error && (
                                <div className="w-full mb-5 p-3 bg-red-100 text-red-600 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {/* 모임 이름 */}
                            <div className="w-full mb-5">
                                <h1 className="font-bold text-gray-800 mb-3">모임 이름</h1>
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
                                <h1 className="font-bold text-gray-800 mb-3">장소</h1>
                                <select
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="w-full h-[44px] rounded-lg bg-gray-50 py-2 px-4 text-semibold appearance-none bg-[url('/icons/polygon_down.svg')] bg-[length:13px_13px] bg-[right_16px_center] bg-no-repeat"
                                >
                                    <option value="">장소를 선택해주세요</option>
                                    <option value="을지로3가">을지로3가</option>
                                    <option value="건대입구">건대입구</option>
                                    <option value="신림">신림</option>
                                    <option value="홍대입구">홍대입구</option>
                                </select>
                            </div>

                            {/* 이미지 첨부 */}
                            <div className="w-full mb-5">
                                <h1 className="font-bold text-gray-800 mb-3">이미지</h1>
                                <div className="w-full flex flex-row items-center gap-5">
                                    <input
                                        type="text"
                                        className="w-full h-[44px] rounded-lg bg-gray-50 py-2 px-4 text-semibold"
                                        placeholder="이미지를 첨부해주세요"
                                        value={fileName}
                                        readOnly
                                    />
                                    <div
                                        className="w-[100px] h-[44px] border-2 border-main-500 text-main-500 font-semibold text-sm px-2 rounded-lg flex flex-row items-center justify-center cursor-pointer hover:bg-main-50"
                                        onClick={handleFileButtonClick}
                                    >
                                        <p>파일 추가</p>
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

                            {/* 서비스 선택 컴포넌트 */}
                            <SelectionService selectedType={formData.type} onSelect={handleServiceTypeSelect} />

                            {/* 날짜 선택 */}
                            <div className="w-full mb-5 flex flex-col md:flex-row items-center gap-5">
                                {/* 모임 날짜 */}
                                <div className="w-full flex flex-col">
                                    <h1 className="font-bold text-gray-800 mb-3">모임 날짜</h1>
                                    <DatePicker
                                        selected={meetingDate}
                                        onChange={(date) => setMeetingDate(date)}
                                        className="w-[70%] md:w-full h-[44px] rounded-lg bg-gray-50 py-2 px-4 text-semibold"
                                        dateFormat="yyyy-MM-dd HH:mm"
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={30}
                                        placeholderText="날짜와 시간을 선택해주세요"
                                    />
                                </div>

                                {/* 마감 날짜 */}
                                <div className="w-full flex flex-col">
                                    <h1 className="font-bold text-gray-800 mb-3">마감 날짜</h1>
                                    <DatePicker
                                        selected={deadlineDate}
                                        onChange={(date) => setDeadlineDate(date)}
                                        className="w-[70%] md:w-full h-[44px] rounded-lg bg-gray-50 py-2 px-4 text-semibold"
                                        dateFormat="yyyy-MM-dd HH:mm"
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={30}
                                        placeholderText="날짜와 시간을 선택해주세요"
                                        maxDate={meetingDate ? new Date(meetingDate.getTime() + 1000) : undefined}
                                    />
                                </div>
                            </div>

                            {/* 모집정원 */}
                            <div className="w-full mb-5">
                                <h1 className="font-bold text-gray-800 mb-3">모집 정원</h1>
                                <input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleInputChange}
                                    min="5"
                                    className="w-full h-[44px] rounded-lg bg-gray-50 py-2 px-4 text-semibold"
                                    placeholder="최소 5인 이상 입력해주세요."
                                />
                            </div>
                        </div>

                        {/* 제출 버튼*/}
                        <div className="w-full p-5 bg-white md:rounded-b-lg flex-shrink-0">
                            <button
                                type="submit"
                                className="w-full bg-main-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-main-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? '처리 중...' : '확인'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {/* 모임 생성 완료/실패 모달 */}
            <ConfirmDialog
                open={confirmDialog.open}
                text={confirmDialog.text}
                onClose={() => setConfirmDialog({ open: false, text: '' })}
                onConfirm={confirmDialog.onConfirm}
            />
        </div>
    );
}