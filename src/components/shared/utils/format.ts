/**
 * 한국 시간대로 변환하는 공용 함수
 * @param date Date 객체 또는 날짜 문자열
 * @returns 한국 시간대로 변환된 Date 객체
 */
export function toKoreanTime(date: Date | string): Date {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Date(dateObj.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
}

/** 
 * 날짜 형식 변환 (한국 시간 기준)
 * @param dateTime 날짜
 * @returns YYYY-MM-DD 변환
 */
export function formatDate(dateTime: string) {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) return '';
    
    const formatter = new Intl.DateTimeFormat('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    
    const parts = formatter.formatToParts(date);
    const year = parts.find(p => p.type === 'year')?.value || '';
    const month = parts.find(p => p.type === 'month')?.value || '';
    const day = parts.find(p => p.type === 'day')?.value || '';
    
    return `${year}-${month}-${day}`;
}

/** 
 * 시간 형식 변환 (한국 시간 기준)
 * @param dateTime 시간
 * @returns HH:MM 변환
 */
export function formatTime(dateTime: string) {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) return '';
    
    const formatter = new Intl.DateTimeFormat('ko-KR', {
        timeZone: 'Asia/Seoul',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    
    return formatter.format(date);
}

/**
 * 마감시간 계산 (한국 시간 기준)
 * @param registrationEnd 마감시간
 * @returns '남은 시간' 또는 '마감됨' 반환
 */
export const getTimeRemaining = (registrationEnd: string) => {
    if (!registrationEnd) return '마감됨';
    
    const end = new Date(registrationEnd);
    const now = new Date();
    
    if (isNaN(end.getTime())) return '마감됨';
    
    const koreanEnd = toKoreanTime(end);
    const koreanNow = toKoreanTime(now);
    
    const diff = koreanEnd.getTime() - koreanNow.getTime();

    // 이미 마감된 경우
    if (diff <= 0) {
        return '마감됨';
    }

    // 날짜 차이 기반 계산 (더 직관적)
    const endDate = new Date(koreanEnd.getFullYear(), koreanEnd.getMonth(), koreanEnd.getDate());
    const nowDate = new Date(koreanNow.getFullYear(), koreanNow.getMonth(), koreanNow.getDate());
    const daysDiff = Math.ceil((endDate.getTime() - nowDate.getTime()) / (1000 * 60 * 60 * 24));

    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    // 1일 이상 남은 경우 (날짜 기준으로 계산)
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
};