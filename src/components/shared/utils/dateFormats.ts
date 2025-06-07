/**
 * 커스텀 dateTimePicker
 * @param year 년
 * @param month 월
 * @param day 일
 * @param hour 시
 * @param minute 분
 * @param period 오전/오후
 */
export interface DateTimeValue {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    period: 'AM' | 'PM';
}

/**
 * 시간 선택 옵션
 */
export const TIME_OPTIONS = {
    hours: Array.from({ length: 12 }, (_, i) => i + 1),
    minutes: Array.from({ length: 12 }, (_, i) => i * 5),
    periods: ['AM', 'PM'] as const
} as const;

/**
 * 한국 시간대로 변환하는 공용 함수
 * @param date 날짜 또는 날짜 문자열
 * @returns 한국 시간 변환 결과
 */
export function toKoreanTime(date: Date | string): Date {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const utcTime = dateObj.getTime() + (dateObj.getTimezoneOffset() * 60000);
    const koreanTime = new Date(utcTime + (9 * 3600000));
    return koreanTime;
}

/**
 * 날짜 형식 변환
 * @param dateTime 날짜 시간
 * @returns 날짜 형식 변환 결과
 */
export function formatDate(dateTime: string) {
    if (!dateTime) return '';
    
    try {
        const date = new Date(dateTime);
        if (isNaN(date.getTime())) return '';
        
        const koreanDate = toKoreanTime(date);
        const year = koreanDate.getFullYear();
        const month = String(koreanDate.getMonth() + 1).padStart(2, '0');
        const day = String(koreanDate.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    } catch (error) {
        console.error('formatDate error:', error);
        return '';
    }
}

/**
 * 시간 형식 변환
 * @param dateTime 날짜 시간
 * @returns 시간 형식 변환 결과
 */
export function formatTime(dateTime: string) {
    if (!dateTime) return '';
    
    try {
        const date = new Date(dateTime);
        if (isNaN(date.getTime())) return '';
        
        const koreanDate = toKoreanTime(date);
        const hours = String(koreanDate.getHours()).padStart(2, '0');
        const minutes = String(koreanDate.getMinutes()).padStart(2, '0');
        
        return `${hours}:${minutes}`;
    } catch (error) {
        console.error('formatTime error:', error);
        return '';
    }
}

/**
 * 날짜를 ISO 문자열로 포맷팅
 * @param date - 날짜
 * @returns ISO 문자열 (YYYY-MM-DDTHH:MM:SS)
 */
export const formatDateToISO = (date: Date): string => {
    return date.toISOString();
};

/**
 * DateTimeValue를 Date로 변환
 */
export const dateTimeValueToDate = (value: DateTimeValue): Date => {
    let hour = value.hour;

    if (value.period === 'PM' && hour !== 12) {
        hour += 12;
    } else if (value.period === 'AM' && hour === 12) {
        hour = 0;
    }

    return new Date(value.year, value.month - 1, value.day, hour, value.minute, 0, 0);
};

/**
 * Date 객체를 DateTimeValue로 변환
 */
export const dateToDateTimeValue = (date: Date): DateTimeValue => {
    let hour = date.getHours();
    const period: 'AM' | 'PM' = hour >= 12 ? 'PM' : 'AM';
    
    if (hour === 0) {
        hour = 12;
    } else if (hour > 12) {
        hour -= 12;
    }
    
    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour,
        minute: date.getMinutes(),
        period
    };
};

/**
 * DateTimeValue를 문자열로 포맷팅
 * @param value - DateTimeValue
 * @returns 문자열
 */
export const formatDateTimeValue = (value: DateTimeValue | null): string => {
    if (!value) return '';
    return `${value.year}-${value.month.toString().padStart(2, '0')}-${value.day.toString().padStart(2, '0')} ${value.hour}:${value.minute.toString().padStart(2, '0')} ${value.period}`;
};

/**
 * 현재 시간보다 이후인지 확인
 * @param dateTimeValue - DateTimeValue 객체
 * @returns 현재 시간 이후면 true
 */
export const isAfterNow = (dateTimeValue: DateTimeValue): boolean => {
    const date = dateTimeValueToDate(dateTimeValue);
    return date > new Date();
};

/**
 * 두 DateTimeValue 비교 (첫 번째가 두 번째보다 이전인지)
 * @param first - 첫 번째 DateTimeValue
 * @param second - 두 번째 DateTimeValue
 * @returns 첫 번째가 두 번째보다 이전이면 true
 */
export const isBefore = (first: DateTimeValue, second: DateTimeValue): boolean => {
    const firstDate = dateTimeValueToDate(first);
    const secondDate = dateTimeValueToDate(second);
    return firstDate < secondDate;
};

/**
 * 달력의 날짜들을 생성하는 함수
 * @param year - 년도
 * @param month - 월 (1-12)
 * @returns Date 배열 (42개 - 6주)
 */
export const generateCalendarDays = (year: number, month: number): Date[] => {
    const firstDay = new Date(year, month - 1, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));
        days.push(date);
    }
    
    return days;
};

/**
 * 날짜가 같은 월인지 확인
 * @param date - 확인할 날짜
 * @param year - 기준 년도
 * @param month - 기준 월 (1-12)
 * @returns 같은 월이면 true
 */
export const isCurrentMonth = (date: Date, year: number, month: number): boolean => {
    return date.getFullYear() === year && date.getMonth() === month - 1;
};

/**
 * 두 날짜가 같은 날인지 확인 (년, 월, 일만 비교)
 * @param date1 - 첫 번째 날짜
 * @param date2 - 두 번째 날짜
 * @returns 같은 날이면 true
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
};

/**
 * 월 이름을 한국어로 반환
 * @param date - 날짜
 * @returns 한국어 월 이름 (예: "2024년 12월")
 */
export const getKoreanMonth = (date: Date): string => {
    return date.toLocaleString('ko-KR', { year: 'numeric', month: 'long' });
};

/**
 * DateTimeValue 유효성 검증
 * @param value - DateTimeValue 객체
 * @returns 유효하면 true
 */
export const isValidDateTimeValue = (value: DateTimeValue | null): boolean => {
    if (!value) return false;
    
    const { year, month, day, hour, minute, period } = value;
    
    if (year < 1900 || year > 3000) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (hour < 1 || hour > 12) return false;
    if (minute < 0 || minute > 59) return false;
    if (!['AM', 'PM'].includes(period)) return false;
    
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && 
           date.getMonth() === month - 1 && 
           date.getDate() === day;
};

/**
 * 마감시간 계산 (개선된 버전 - DateTimeValue와 isBefore 활용)
 * @param registrationEnd 마감시간 (string 또는 DateTimeValue)
 * @returns 마감시간 계산 결과
 */
export const getTimeRemaining = (registrationEnd: string | DateTimeValue): string => {
    if (!registrationEnd) return '마감됨';
    
    try {
        let endDateTimeValue: DateTimeValue;
        
        // string인 경우 Date로 변환 후 DateTimeValue로 변환
        if (typeof registrationEnd === 'string') {
            const endDate = new Date(registrationEnd);
            if (isNaN(endDate.getTime())) return '마감됨';
            
            // 한국 시간으로 변환
            const koreanEndDate = toKoreanTime(endDate);
            endDateTimeValue = dateToDateTimeValue(koreanEndDate);
        } else {
            // 이미 DateTimeValue인 경우
            endDateTimeValue = registrationEnd;
        }
        
        // 현재 시간을 DateTimeValue로 변환
        const now = new Date();
        const koreanNow = toKoreanTime(now);
        const nowDateTimeValue = dateToDateTimeValue(koreanNow);
        
        // isBefore 함수를 사용해서 마감일이 현재보다 이전인지 확인
        if (isBefore(endDateTimeValue, nowDateTimeValue) || !isAfterNow(endDateTimeValue)) {
            return '마감됨';
        }
        
        // 시간 차이 계산을 위해 Date 객체로 변환
        const endDate = dateTimeValueToDate(endDateTimeValue);
        const nowDate = dateTimeValueToDate(nowDateTimeValue);
        const diff = endDate.getTime() - nowDate.getTime();
        
        // 날짜 차이 계산 (같은 날인지 확인)
        const endDateOnly = new Date(endDateTimeValue.year, endDateTimeValue.month - 1, endDateTimeValue.day);
        const nowDateOnly = new Date(nowDateTimeValue.year, nowDateTimeValue.month - 1, nowDateTimeValue.day);
        const daysDiff = Math.ceil((endDateOnly.getTime() - nowDateOnly.getTime()) / (1000 * 60 * 60 * 24));
        
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        // 1일 이상 남은 경우
        if (daysDiff > 0) {
            return `${daysDiff}일 후 마감`;
        }
        
        // 당일인 경우 시간으로 표시
        if (hours > 0) {
            return `${hours}시간 후 마감`;
        }
        
        if (minutes > 0) {
            return `${minutes}분 후 마감`;
        }
        
        return '곧 마감';
    } catch (error) {
        console.error('getTimeRemaining error:', error);
        return '마감됨';
    }
};



/**
 * 필터링 날짜 비교 함수
 * @param dateTimeString ISO 문자열 또는 날짜 문자열
 * @param targetDate YYYY-MM-DD 형식 문자열
 * @returns 같은 날짜면 true
 */
export const isSameDateForFilter = (dateTimeString: string, targetDate: string): boolean => {
    if (!dateTimeString || !targetDate) return false;
    
    try {
        // ISO 문자열에서 직접 날짜 부분만 추출
        const extractedDate = dateTimeString.substring(0, 10);
        return extractedDate === targetDate;
    } catch (error) {
        console.warn('날짜 비교 오류:', error);
        return false;
    }
};


/**
 * 기존 formatDate 함수와 동일한 결과를 보장하는 날짜 추출
 * @param dateTimeString 날짜 시간 문자열
 * @returns YYYY-MM-DD 형식 문자열
 */
export const extractDateString = (dateTimeString: string): string => {
    if (!dateTimeString) return '';
    
    try {
        // 기존 formatDate와 동일한 방식으로 한국 시간 변환
        const date = new Date(dateTimeString);
        if (isNaN(date.getTime())) return '';
        
        const koreanDate = toKoreanTime(date);
        const year = koreanDate.getFullYear();
        const month = String(koreanDate.getMonth() + 1).padStart(2, '0');
        const day = String(koreanDate.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    } catch (error) {
        console.error('extractDateString error:', error);
        return '';
    }
};