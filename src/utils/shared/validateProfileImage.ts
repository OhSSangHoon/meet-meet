// 공통 프로필 기본 이미지 URL
const DEFAULT_PROFILE_IMAGE = 'https://res.cloudinary.com/dbvzbdffi/image/upload/v1749717219/profile_image_tlr92v.svg';

/**
 * 이미지 URL이 없거나, 빈 문자열이거나, 'null' 문자열이면 기본 이미지를 반환합니다.
 * @param imageUrl 원본 이미지 URL
 * @param fallback 기본 이미지 URL (옵션)
 * @returns 유효한 이미지 URL
 */
export const validateProfileImage = (
    imageUrl?: string | null,
    fallback: string = DEFAULT_PROFILE_IMAGE
): string => {
    if (!imageUrl || imageUrl === 'null' || imageUrl.trim() === '') return fallback;
    return imageUrl;
}
