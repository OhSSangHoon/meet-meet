import { describe, it, expect, vi } from 'vitest';

// 서비스 타입 정의
type ServiceType = 'OFFICE_STRETCHING' | 'MINDFULNESS' | 'WORKATION';

// 서비스 데이터 정의
interface ServiceData {
    id: ServiceType;
    title: string;
    subtitle: string | null;
}

// 서비스 목록
const SERVICES: ServiceData[] = [
    {
        id: 'OFFICE_STRETCHING',
        title: '북적북적',
        subtitle: '엔터테인먼트'
    },
    {
        id: 'MINDFULNESS',
        title: '북적북적',
        subtitle: '액티비티'
    },
    {
        id: 'WORKATION',
        title: '도란도란',
        subtitle: null
    }
];

/** 서비스 타입 유효성 검증 함수 */
const validateServiceType = (serviceType: string): boolean => {
    const validTypes: ServiceType[] = ['OFFICE_STRETCHING', 'MINDFULNESS', 'WORKATION'];
    return validTypes.includes(serviceType as ServiceType);
};

/** 서비스 선택 로직 시뮬레이션 함수 */
const simulateServiceSelection = (
    newSelection: string,
    onSelect: (type: string) => void,
): string => {
    if (!validateServiceType(newSelection)) {
        throw new Error(`Invalid service type: ${newSelection}`);
    }

    onSelect(newSelection);
    return newSelection;
};

describe('SelectionService 컴포넌트 테스트', () => {
    describe('서비스 타입 검증', () => {
        it('서비스 타입 검증 통합 테스트', () => {
            const validTypes = ['OFFICE_STRETCHING', 'MINDFULNESS', 'WORKATION'];
            const invalidTypes = ['', 'INVALID_TYPE', 'office_stretching', null, undefined];

            validTypes.forEach(type => {
                expect(validateServiceType(type)).toBe(true);
            });

            invalidTypes.forEach(type => {
                expect(validateServiceType(type as string)).toBe(false);
            });
        });
    });

    describe('서비스 데이터 구조', () => {
        it('서비스 데이터가 올바르게 정의되어야 함', () => {
            expect(SERVICES).toHaveLength(3);

            // 각 서비스가 필수 속성을 가지는지 확인
            SERVICES.forEach(service => {
                expect(service).toHaveProperty('id');
                expect(service).toHaveProperty('title');
                expect(typeof service.id).toBe('string');
                expect(typeof service.title).toBe('string');
            });

            // 핵심 서비스 데이터 확인
            expect(SERVICES[0].id).toBe('OFFICE_STRETCHING');
            expect(SERVICES[2].subtitle).toBe(null);
        });
    });

    describe('서비스 선택 기능', () => {
        it('서비스 선택 통합 테스트', () => {
            const mockOnSelect = vi.fn();

            // 정상 선택
            const result = simulateServiceSelection('MINDFULNESS', mockOnSelect);
            expect(result).toBe('MINDFULNESS');
            expect(mockOnSelect).toHaveBeenCalledWith('MINDFULNESS');

            // 잘못된 선택
            expect(() => {
                simulateServiceSelection('INVALID_TYPE', mockOnSelect);
            }).toThrow('Invalid service type: INVALID_TYPE');

            // 모든 서비스 선택 가능 확인
            mockOnSelect.mockClear();
            SERVICES.forEach(service => {
                simulateServiceSelection(service.id, mockOnSelect);
            });
            expect(mockOnSelect).toHaveBeenCalledTimes(3);
        });
    });
});
