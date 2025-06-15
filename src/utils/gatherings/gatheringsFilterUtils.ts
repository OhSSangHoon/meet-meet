import { Gathering } from '@/types/gatherings';
import { getTimeRemaining } from '@/utils/shared/date';

/**
 * 진행중인 모임인지 확인
 * @param gathering 모임 객체
 * @returns 진행중이면 true
 */
export const isActiveGathering = (gathering: Gathering): boolean => {
    const timeRemaining = getTimeRemaining(gathering.registrationEnd);
    return timeRemaining !== '마감됨';
};

/**
 * 진행중인 모임들만 필터링
 * @param gatherings 모임 목록
 * @returns 진행중인 모임 목록
 */
export const filterActiveGatherings = (gatherings: Gathering[]): Gathering[] => {
    return gatherings.filter(isActiveGathering);
};

/**
 * 중복 모임 제거
 * @param gatherings 모임 목록
 * @returns 중복 제거된 모임 목록
 */
export const removeDuplicateGatherings = (gatherings: Gathering[]): Gathering[] => {
    const seen = new Set<number>();
    return gatherings.filter(gathering => {
        if (seen.has(gathering.id)) {
            return false;
        }
        seen.add(gathering.id);
        return true;
    });
};

/**
 * 두 모임 목록에서 중복되지 않는 항목만 반환
 * @param sourceGatherings 소스 모임 목록
 * @param existingGatherings 기존 모임 목록 (중복 체크 기준)
 * @returns 중복되지 않는 모임 목록
 */
export const getUniqueGatherings = (
    sourceGatherings: Gathering[],
    existingGatherings: Gathering[]
): Gathering[] => {
    const existingIds = new Set(existingGatherings.map(g => g.id));
    return sourceGatherings.filter(g => !existingIds.has(g.id));
};