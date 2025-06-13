// 유틸 함수 통합 파일

// 타입
export {
    getApiTypeFromMainType,
    filterGatheringsByMainType,
    filterGatheringsByType
} from '@/components/gatherings/shared/utils/gatheringsTypeUtils';

// 필터링
export {
    isActiveGathering,
    filterActiveGatherings,
    removeDuplicateGatherings,
    getUniqueGatherings
} from '@/components/gatherings/shared/utils/gatheringsFilterUtils';

// 파라미터
export {
    buildGatheringParams,
    isValidDateString,
    type GatheringApiParams
} from '@/components/gatherings/shared/utils/gatheringsParamUtils';

// 응답 처리
export {
    normalizeGatheringsResponse,
    handleGatheringsError
} from '@/components/gatherings/shared/utils/gatheringsResponseUtils';

// 상수
export { GATHERING_CONSTANTS, GATHERING_TYPES } from '@/components/gatherings/shared/constants/gatheringsConstants';
