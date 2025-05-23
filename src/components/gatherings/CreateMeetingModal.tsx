"use client"

import { XIcon } from "lucide-react";
import SelectionService from "./SelectionService";
import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

export default function CreateMeetingModal({ onClose }: { onClose: () => void }) {

    // 폼 데이터 상태 관리
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        capacity: 5,
        type: 'OFFICE_STRETCHING' // 기본값 설정
    });

    // 파일명 상태
    const [fileName, setFileName] = useState("");
    // 이미지 파일
    const [imageFile, setImageFile] = useState<File | null>(null);
    // 파일 입력 요소에 접근하기 위한 ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 모임 날짜
    const [meetingDate, setMeetingDate] = useState<Date | null>(null);
    // 마감 날짜
    const [deadlineDate, setDeadlineDate] = useState<Date | null>(null);
    
    // 제출 상태 관리
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
    
    // 모달이 열릴 때 스크롤 방지 
    useEffect(() => {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
        };
    }, []);
    
    // 파일 추가 버튼 클릭 핸들러
    const handleFileButtonClick = () => {
        // 숨겨진 파일 입력 요소 클릭
        fileInputRef.current?.click();
    };
    
    // 파일 선택 핸들러
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        
        if (files && files.length > 0) {
            const file = files[0]; // 첫 번째 파일만 사용
            setFileName(file.name); // 파일명 상태 업데이트
            setImageFile(file); // 파일 객체 저장
        }
    };
    
    // 폼 제출 핸들러
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 로그인
        const token = localStorage.getItem('token');
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
        
        try {
            setIsSubmitting(true);
            setError(null);
            
            // 토큰 가져오기
            const token = localStorage.getItem('token');
            
            if (!token) {
                throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
            }
            
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
            
            const response = await axios.post('/api/gatherings', apiFormData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log(response);

            // 성공 시 모달 닫기
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('API 요청 중 오류 발생:', error);

            if(axios.isAxiosError(error)) {
                if (error.response) {
                    setError(error.response.data.message || '모임 생성 중 오류가 발생했습니다.');
                } else if (error.request) {
                setError('서버에 연결할 수 없습니다.');
            } else {
                    setError(error.message || '모임 생성 중 오류가 발생했습니다.');
                }
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="fixed inset-0 z-50">
            {/* 배경 어둡게 */}
            <div className="absolute inset-0 bg-black opacity-50"></div>
            {/* 모달 컨테이너 */}
            <div className="relative flex flex-col justify-center items-center md:top-10">
                <form 
                    className="flex flex-col md:w-xl w-full h-full md:m-auto p-5 bg-white md:rounded-lg"
                    onSubmit={handleSubmit}
                >
                    {/* 모임 만들기 타이틀 */}
                    <div className="w-full h-[50px] bg-white rounded-lg flex flex-row justify-between items-center mb-5">
                        <h1 className="text-lg font-bold text-gray-800">모임 만들기</h1>
                        <button type="button" onClick={onClose}>
                            <XIcon className="w-7 h-7 text-gray-500" />
                        </button>
                    </div>
                    
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
                                maxDate={meetingDate ? new Date(meetingDate.getTime() + 1000) : undefined} // 모임 날짜 이후는 선택 불가
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
                    
                    {/* 제출 버튼 */}
                    <div className="w-full">
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
    );
}