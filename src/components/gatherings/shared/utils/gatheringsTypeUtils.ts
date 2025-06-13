import { Gathering } from '@/types/gatherings';
import { GATHERING_TYPES } from '@/components/gatherings/shared/constants/gatheringsConstants';

/**
 * 메인타입을 API 타입으로 변환
 * @param mainType 메인타입 (DALLAEMFIT | DORANDORAN)
 * @returns API 타입 (DALLAEMFIT | WORKATION)
 */
export const getApiTypeFromMainType = (mainType: string): string => {
    return mainType === GATHERING_TYPES.MAIN.DORANDORAN
        ? GATHERING_TYPES.API.WORKATION
        : GATHERING_TYPES.API.DALLAEMFIT;
};

/**
 * 메인타입별 모임 필터링
 * @param gatherings 모임 목록
 * @param mainType 메인타입
 * @returns 필터링된 모임 목록
 */
export const filterGatheringsByMainType = (
    gatherings: Gathering[],
    mainType: string
): Gathering[] => {
    if (mainType === GATHERING_TYPES.MAIN.DORANDORAN) {
        return gatherings.filter(gathering =>
            gathering.type === GATHERING_TYPES.API.WORKATION
        );
    } else {
        return gatherings.filter(gathering =>
            gathering.type === GATHERING_TYPES.SUB.OFFICE_STRETCHING ||
            gathering.type === GATHERING_TYPES.SUB.MINDFULNESS
        );
    }
};

/**
 * 메인타입과 서브타입별 모임 필터링
 * @param gatheringsList 모임 목록
 * @param selectedMainType 선택된 메인타입
 * @param selectedSubType 선택된 서브타입
 * @returns 필터링된 모임 목록
 */
export const filterGatheringsByType = (
    gatheringsList: Gathering[],
    selectedMainType: string,
    selectedSubType: string
): Gathering[] => {
    // 먼저 메인타입으로 필터링
    const mainTypeFiltered = filterGatheringsByMainType(gatheringsList, selectedMainType);

    // 달램핏이고 서브타입이 ALL이 아닌 경우만 추가 필터링
    if (selectedMainType === GATHERING_TYPES.MAIN.DALLAEMFIT &&
        selectedSubType !== GATHERING_TYPES.SUB.ALL) {
        return mainTypeFiltered.filter(gathering => gathering.type === selectedSubType);
    }

    return mainTypeFiltered;
};
