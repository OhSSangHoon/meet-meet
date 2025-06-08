import { z } from 'zod';
import { DateTimeValue, isValidDateTimeValue, isAfterNow, isBefore } from '@/components/shared/utils/dateFormats';

/**
 * 파일 크기 검증 함수 (5MB)
 */
const validateFileSize = (file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    return file.size <= maxSize;
};

/**
 * 이미지 파일 타입 검증 함수
 */
const validateImageType = (file: File) => {
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/svg+xml',
        'image/avif',
        'image/webp'
    ];
    return allowedTypes.includes(file.type);
};

/**
 * DateTimeValue 유효성 검증 함수
 */
const validateDateTimeValue = (value: DateTimeValue | null) => {
    if (!value) return false;
    return isValidDateTimeValue(value) && isAfterNow(value);
};

/**
 * 마감일이 모임일보다 이전인지 검증 함수
 */
const validateDeadlineBeforeGathering = (
    deadlineDateTime: DateTimeValue | null,
    meetingDateTime: DateTimeValue | null
) => {
    if (!deadlineDateTime || !meetingDateTime) return true;
    return isBefore(deadlineDateTime, meetingDateTime);
};

/**
 * 모임 생성 폼 스키마
 */
export const createGatheringFormSchema = z.object({
    name: z
        .string()
        .min(1, '모임 이름을 입력해주세요.'),

    location: z
        .string()
        .min(1, '장소를 선택해주세요.'),

    capacity: z
        .number()
        .min(5, '모집 정원은 최소 5명 이상이어야 합니다.'),

    type: z
        .string()
        .min(1, '서비스 타입을 선택해주세요.'),

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
        }, '이미지 파일 타입이 맞지않습니다. jpg, png, gif, svg, avif, webp 파일만 가능합니다.'),

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
        }, '마감 날짜는 현재 시간 이후여야 합니다.')
}).refine((data) => {
    return validateDeadlineBeforeGathering(data.deadlineDateTime, data.meetingDateTime);
}, {
    message: '마감일은 모임일 이전이어야 합니다.',
    path: ['deadlineDateTime']
});

/**
 * 토큰 검증 스키마
 */
export const tokenSchema = z
    .string()
    .min(1, '로그인이 필요한 서비스입니다.');

/**
 * 모임 생성 폼 데이터 타입 (수동 정의)
 */
export type CreateGatheringFormSchemaType = {
    name: string;
    location: string;
    capacity: number;
    type: string;
    imageFile: File | null;
    meetingDateTime: DateTimeValue | null;
    deadlineDateTime: DateTimeValue | null;
};

/**
 * 모임 생성 전체 검증 (토큰 포함)
 */
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