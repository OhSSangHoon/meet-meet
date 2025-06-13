import { z } from 'zod';
import { DateTimeValue, isValidDateTimeValue, isAfterNow, isBefore } from '@/components/shared/utils/dateFormats';

/** * 파일 크기 검증 함수 (5MB) */
export const validateFileSize = (file: File) => {
    const maxSize = 5 * 1024 * 1024;
    return file.size <= maxSize;
};

/** * 이미지 파일 타입 검증 함수 */
export const validateImageType = (file: File) => {
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/avif',
        'image/bmp'
    ];

    // SVG 파일 명시적 차단
    if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) return false;

    return allowedTypes.includes(file.type);
};

/** 모임 이름 검증 함수 */
export const validateGatheringName = (name: string) => {
    // 원본 문자열에서 앞뒤 공백 제거
    const trimmedName = name.trim();

    // 빈 문자열 체크 (공백만 있는 경우도 포함)
    if (!trimmedName || trimmedName.length === 0) return false;

    // 특수문자 체크
    const allowedSpecialChars = /^[가-힣a-zA-Z0-9\s\-_.,!?()[\]{}'"]+$/;
    if (!allowedSpecialChars.test(trimmedName)) return false;

    // 길이 체크
    if (trimmedName.length < 1 || trimmedName.length > 20) return false;

    return true;
};

/** DateTimeValue 유효성 검증 함수 */
export const validateDateTimeValue = (value: DateTimeValue | null) => {
    if (!value) return false;
    return isValidDateTimeValue(value) && isAfterNow(value);
};

/** 마감일이 모임일보다 이전인지 검증 함수 */
export const validateDeadlineBeforeGathering = (
    deadlineDateTime: DateTimeValue | null,
    meetingDateTime: DateTimeValue | null
) => {
    if (!deadlineDateTime || !meetingDateTime) return true;
    return isBefore(deadlineDateTime, meetingDateTime);
};

/** 모임 생성 폼 스키마 */
export const createGatheringFormSchema = z.object({
    name: z
        .string()
        .refine((val) => {
            // 먼저 원본 값으로 공백만 있는지 체크
            const trimmed = val.trim();
            if (!trimmed) return false;
            return validateGatheringName(val);
        }, {
            message: '모임 이름은 1-20자 이내로 입력하고, 특수문자는 제한됩니다. 연속된 공백은 사용할 수 없습니다.'
        })
        .transform((val) => val.trim()), // 검증 통과 후 공백 제거

    location: z
        .string()
        .min(1, '장소를 선택해주세요.'),

    imageFile: z
        .custom<File | null>()
        .nullable()
        .refine((file) => file !== null, '이미지를 첨부해주세요.')
        .refine((file) => {
            if (!file) return false;
            return validateFileSize(file);
        }, '이미지 파일 크기가 너무 큽니다. 5MB 이하로 첨부해주세요.')
        .refine((file) => {
            if (!file) return false;
            return validateImageType(file);
        }, 'SVG 파일은 보안상 업로드할 수 없습니다. JPG, PNG, GIF, WebP, AVIF, BMP 파일만 업로드 가능합니다.'),

    type: z
        .string()
        .min(1, '서비스 타입을 선택해주세요.'),

    meetingDateTime: z
        .custom<DateTimeValue | null>()
        .nullable()
        .refine((value) => value !== null, '모임 일정을 선택해주세요.')
        .refine((value) => {
            if (!value) return false;
            return validateDateTimeValue(value);
        }, '모임 날짜는 현재 시간 이후여야 합니다.'),

    deadlineDateTime: z
        .custom<DateTimeValue | null>()
        .nullable()
        .refine((value) => {
            if (!value) return true;
            return isValidDateTimeValue(value) && isAfterNow(value);

        }, '마감 날짜는 현재 시간 이후여야 합니다.'),

    capacity: z
        .number()
        .min(5, '모집 정원은 최소 5명 이상이어야 합니다.')
        .max(20, '모집 정원은 최대 20명까지 가능합니다.')
}).refine((data) => {
    return validateDeadlineBeforeGathering(data.deadlineDateTime, data.meetingDateTime);
}, {
    message: '마감일은 모임일 이전이어야 합니다.',
    path: ['deadlineDateTime']
});

/** 토큰 검증 스키마 */
export const tokenSchema = z
    .string()
    .min(1, '로그인이 필요한 서비스입니다.');

/** 모임 생성 폼 데이터 타입 */
export type CreateGatheringFormSchemaType = {
    name: string;
    location: string;
    capacity: number;
    type: string;
    imageFile: File | null;
    meetingDateTime: DateTimeValue | null;
    deadlineDateTime: DateTimeValue | null;
};

/** 모임 생성 전체 검증 */
export const validateCreateGathering = (
    formData: CreateGatheringFormSchemaType,
    token: string | null
) => {
    // 토큰 검증
    const tokenResult = tokenSchema.safeParse(token);
    if (!tokenResult.success) {
        return { success: false, error: tokenResult.error.errors[0].message };
    }

    // 폼 데이터 검증
    const formResult = createGatheringFormSchema.safeParse(formData);
    if (!formResult.success) {
        return { success: false, error: formResult.error.errors[0].message };
    }

    return { success: true, data: formResult.data };
};