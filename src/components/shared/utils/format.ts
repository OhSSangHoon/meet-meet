/** 
 * 날짜 형식 변환
 * @param dateTime 날짜
 * @returns YYYY-MM-DD 변환
 */
export function formatDate(dateTime: string) {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
}

/** 
 * 시간 형식 변환
 * @param dateTime 시간
 * @returns HH:MM 변환
 */
export function formatTime(dateTime: string) {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[1].slice(0, 5);
}

/**
 * 마감시간 계산
 * @param registrationEnd 마감시간
 * @returns 'O일 O시간 남음` 변환
 */
export const getTimeRemaining = (registrationEnd: string) => {
    const end = new Date(registrationEnd);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours >= 24) {
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        return `${days}일 ${remainingHours}시간 남음`;
    } else if (hours > 0) {
        return `오늘 ${hours}시간 남음`;
    } else {
        return '마감됨';
    }
};