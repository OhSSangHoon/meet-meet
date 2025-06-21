import { describe, it, expect } from 'vitest';

// DateTimeValue 타입 정의
interface DateTimeValue {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    period: 'AM' | 'PM';
}

// 날짜/시간 관련 유틸리티 함수들
const convertToDate = (dateTimeValue: DateTimeValue): Date => {
    let hour = dateTimeValue.hour;
    if (dateTimeValue.period === 'PM' && hour !== 12) {
        hour += 12;
    }
    if (dateTimeValue.period === 'AM' && hour === 12) {
        hour = 0;
    }

    return new Date(dateTimeValue.year, dateTimeValue.month - 1, dateTimeValue.day, hour, dateTimeValue.minute);
};

/** 날짜 유효성 검증 함수 */
const validateDateTime = (dateTime: Date | null): boolean => {
    if (!dateTime) return false;
    const now = new Date();
    return dateTime > now;
};

/** 마감시간과 모임시간 관계 검증 함수 */
const validateRegistrationDeadline = (deadline: DateTimeValue, gatheringTime: DateTimeValue): boolean => {
    const deadlineDate = convertToDate(deadline);
    const gatheringDate = convertToDate(gatheringTime);
    return deadlineDate < gatheringDate;
};

/** 날짜/시간 관련 비즈니스 로직 검증 함수 */
const validateGatheringDateTime = (gatheringTime: DateTimeValue, deadline?: DateTimeValue): { isValid: boolean; error?: string } => {
    // 1. 모임 시간이 미래인지 확인
    if (!isValidDateTimeValue(gatheringTime)) {
        return { isValid: false, error: '모임 시간이 과거이거나 유효하지 않습니다.' };
    }

    // 2. 마감시간이 있다면 모임시간보다 이전인지 확인
    if (deadline) {
        if (!isValidDateTimeValue(deadline)) {
            return { isValid: false, error: '마감 시간이 과거이거나 유효하지 않습니다.' };
        }

        if (!validateRegistrationDeadline(deadline, gatheringTime)) {
            return { isValid: false, error: '마감시간은 모임시간보다 이전이어야 합니다.' };
        }
    }

    return { isValid: true };
};

const isValidDateTimeValue = (value: DateTimeValue | null): boolean => {
    if (!value) return false;

    const { year, month, day, hour, minute, period } = value;

    // 기본 범위 검증
    if (year < 2000 || year > 3000) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (hour < 1 || hour > 12) return false;
    if (minute < 0 || minute > 59) return false;
    if (period !== 'AM' && period !== 'PM') return false;

    // 실제 날짜 유효성 검증
    const date = convertToDate(value);
    return validateDateTime(date);
};

// 달력 관련 함수들
const generateCalendarDays = (currentDate: Date): Date[] => {
    const CALENDAR_DAYS_COUNT = 42;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < CALENDAR_DAYS_COUNT; i++) {
        const date = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));
        days.push(date);
    }

    return days;
};

const isCurrentMonth = (date: Date, currentDate: Date): boolean => {
    return date.getMonth() === currentDate.getMonth();
};

// 시간 옵션 상수
const TIME_OPTIONS = {
    hours: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    minutes: [0, 15, 30, 45]
};

describe('DateTimePicker 컴포넌트 테스트', () => {
    describe('DateTimeValue 검증', () => {
        it('유효한 DateTimeValue는 통과해야 함', () => {
            const futureDateTime: DateTimeValue = {
                year: 2025,
                month: 7,
                day: 15,
                hour: 2,
                minute: 30,
                period: 'PM'
            };

            expect(isValidDateTimeValue(futureDateTime)).toBe(true);
        });

        it('과거 날짜는 실패해야 함', () => {
            const pastDateTime: DateTimeValue = {
                year: 2024,
                month: 12,
                day: 1,
                hour: 9,
                minute: 0,
                period: 'AM'
            };

            expect(isValidDateTimeValue(pastDateTime)).toBe(false);
        });

        it('null 값은 실패해야 함', () => {
            expect(isValidDateTimeValue(null)).toBe(false);
        });

        it('잘못된 범위 값들은 실패해야 함', () => {
            const invalidCases: DateTimeValue[] = [
                { year: 1999, month: 6, day: 15, hour: 10, minute: 30, period: 'AM' }, // 연도 범위 초과
                { year: 2025, month: 13, day: 15, hour: 10, minute: 30, period: 'AM' }, // 월 범위 초과
                { year: 2025, month: 6, day: 32, hour: 10, minute: 30, period: 'AM' }, // 일 범위 초과
                { year: 2025, month: 6, day: 15, hour: 13, minute: 30, period: 'AM' }, // 시간 범위 초과
                { year: 2025, month: 6, day: 15, hour: 10, minute: 60, period: 'AM' }, // 분 범위 초과
            ];

            invalidCases.forEach(invalidCase => {
                expect(isValidDateTimeValue(invalidCase)).toBe(false);
            });
        });
    });

    describe('시간 변환 테스트', () => {
        it('AM/PM 시간 변환이 올바르게 작동해야 함', () => {
            const testCases = [
                { input: { year: 2025, month: 7, day: 15, hour: 12, minute: 0, period: 'AM' }, expectedHour: 0 },
                { input: { year: 2025, month: 7, day: 15, hour: 1, minute: 0, period: 'AM' }, expectedHour: 1 },
                { input: { year: 2025, month: 7, day: 15, hour: 12, minute: 0, period: 'PM' }, expectedHour: 12 },
                { input: { year: 2025, month: 7, day: 15, hour: 1, minute: 0, period: 'PM' }, expectedHour: 13 },
                { input: { year: 2025, month: 7, day: 15, hour: 11, minute: 59, period: 'PM' }, expectedHour: 23 },
            ];

            testCases.forEach(({ input, expectedHour }) => {
                const convertedDate = convertToDate(input as DateTimeValue);
                expect(convertedDate.getHours()).toBe(expectedHour);
            });
        });
    });

    describe('달력 및 시간 옵션', () => {
        it('달력 생성 및 옵션 검증', () => {
            const currentDate = new Date(2025, 6, 15); // 2025년 7월 15일
            const calendarDays = generateCalendarDays(currentDate);

            // 달력 기본 검증
            expect(calendarDays).toHaveLength(42);
            expect(calendarDays[0].getDay()).toBe(0); // 일요일 = 0

            // 현재 월 판별
            const julyDate = new Date(2025, 6, 10);
            const augustDate = new Date(2025, 7, 5);
            expect(isCurrentMonth(julyDate, currentDate)).toBe(true);
            expect(isCurrentMonth(augustDate, currentDate)).toBe(false);

            // 시간 옵션 검증
            expect(TIME_OPTIONS.hours).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
            expect(TIME_OPTIONS.minutes).toEqual([0, 15, 30, 45]);

            TIME_OPTIONS.hours.forEach(hour => {
                expect(hour).toBeGreaterThanOrEqual(1);
                expect(hour).toBeLessThanOrEqual(12);
            });

            TIME_OPTIONS.minutes.forEach(minute => {
                expect(minute).toBeGreaterThanOrEqual(0);
                expect(minute).toBeLessThanOrEqual(59);
            });
        });
    });

    describe('컴포넌트 상태 및 마감시간 검증', () => {
        it('날짜/시간 상태 관리 시뮬레이션', () => {
            // 날짜 선택 시 DateTimeValue 생성
            const selectedDate = new Date(2025, 6, 20);
            const existingTime = { hour: 10, minute: 30, period: 'AM' as const };

            const newValue: DateTimeValue = {
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate(),
                hour: existingTime.hour,
                minute: existingTime.minute,
                period: existingTime.period
            };

            expect(newValue.year).toBe(2025);
            expect(newValue.month).toBe(7);
            expect(newValue.day).toBe(20);
            expect(newValue.hour).toBe(10);
            expect(newValue.minute).toBe(30);
            expect(newValue.period).toBe('AM');

            // 시간 변경 시 기존 날짜 유지
            const updatedValue = {
                ...newValue,
                hour: 2,
                period: 'PM' as const
            };

            expect(updatedValue.year).toBe(2025);
            expect(updatedValue.month).toBe(7);
            expect(updatedValue.day).toBe(20);
            expect(updatedValue.hour).toBe(2);
            expect(updatedValue.period).toBe('PM');
        });

        it('마감시간과 모임시간 관계 검증', () => {
            const gatheringTime: DateTimeValue = {
                year: 2025,
                month: 7,
                day: 20,
                hour: 2,
                minute: 0,
                period: 'PM'
            };

            const validDeadline: DateTimeValue = {
                year: 2025,
                month: 7,
                day: 20,
                hour: 12,
                minute: 0,
                period: 'PM'
            };

            const invalidDeadline: DateTimeValue = {
                year: 2025,
                month: 7,
                day: 20,
                hour: 3,
                minute: 0,
                period: 'PM'
            };

            expect(validateRegistrationDeadline(validDeadline, gatheringTime)).toBe(true);
            expect(validateRegistrationDeadline(invalidDeadline, gatheringTime)).toBe(false);
        });

        it('모임 생성 시나리오 통합 검증', () => {
            const futureGatheringTime: DateTimeValue = {
                year: 2025,
                month: 8,
                day: 15,
                hour: 3,
                minute: 0,
                period: 'PM'
            };

            const validDeadline: DateTimeValue = {
                year: 2025,
                month: 8,
                day: 15,
                hour: 1,
                minute: 0,
                period: 'PM'
            };

            const invalidDeadline: DateTimeValue = {
                year: 2025,
                month: 8,
                day: 15,
                hour: 4,
                minute: 0,
                period: 'PM'
            };

            // 마감시간이 없는 경우
            expect(validateGatheringDateTime(futureGatheringTime).isValid).toBe(true);

            // 유효한 마감시간이 있는 경우
            expect(validateGatheringDateTime(futureGatheringTime, validDeadline).isValid).toBe(true);

            // 마감시간이 모임시간보다 늦은 경우
            const result = validateGatheringDateTime(futureGatheringTime, invalidDeadline);
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('마감시간은 모임시간보다 이전이어야 합니다.');

            // 실제 시나리오들
            const testCases = [
                {
                    gatheringTime: { year: 2025, month: 8, day: 10, hour: 3, minute: 0, period: 'PM' as const },
                    deadline: { year: 2025, month: 8, day: 10, hour: 2, minute: 0, period: 'PM' as const },
                    expectedValid: true
                },
                {
                    gatheringTime: { year: 2025, month: 8, day: 10, hour: 3, minute: 0, period: 'PM' as const },
                    deadline: { year: 2025, month: 8, day: 10, hour: 3, minute: 0, period: 'PM' as const },
                    expectedValid: false
                },
                {
                    gatheringTime: { year: 2025, month: 8, day: 10, hour: 3, minute: 0, period: 'PM' as const },
                    deadline: undefined,
                    expectedValid: true
                }
            ];

            testCases.forEach(({ gatheringTime, deadline, expectedValid }) => {
                const result = validateGatheringDateTime(gatheringTime, deadline);
                expect(result.isValid).toBe(expectedValid);
            });
        });
    });

    describe('에러 케이스 및 경계값 테스트', () => {
        it('잘못된 DateTimeValue 및 경계값 처리', () => {
            // 잘못된 값들
            const invalidValues = [
                null,
                undefined,
                { year: 2025, month: 6, day: 15 }, // 시간 정보 누락
                { hour: 10, minute: 30, period: 'AM' }, // 날짜 정보 누락
            ];

            invalidValues.forEach(value => {
                expect(isValidDateTimeValue(value as unknown as DateTimeValue)).toBe(false);
            });

            // 경계값 테스트 (미래 날짜로 조정)
            const boundaryTests = [
                { year: 2026, month: 1, day: 1, hour: 1, minute: 0, period: 'AM' as const },
                { year: 2026, month: 12, day: 31, hour: 12, minute: 59, period: 'PM' as const },
            ];

            boundaryTests.forEach(test => {
                expect(isValidDateTimeValue(test)).toBe(true);
            });
        });
    });
});