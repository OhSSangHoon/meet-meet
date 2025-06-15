/**
 * 사용자가 찜한 모임 ID 목록을 로컬 스토리지에서 가져옵니다.
 * @returns {string[]} 찜한 모임 ID 배열. 서버사이드에서 실행 시 빈 배열 반환
 */
export const getSavedGatherings = (): string[] => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem("savedGatherings") || "[]");
};

/**
 * 사용자가 찜한 모임 ID 목록을 로컬 스토리지에 저장합니다.
 * @param {string[]} ids - 저장할 모임 ID 배열
 * @returns {void}
 */
export const setSavedGatherings = (ids: string[]): void => {
    localStorage.setItem("savedGatherings", JSON.stringify(ids));
};