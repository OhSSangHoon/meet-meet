import { UserResponse } from '@/types/auth';

/** 유저 정보 */
export const mockUser: UserResponse = {
    teamId: "6-present",
    id: 1234,
    email: "test@meetmeet.com",
    name: "테스트 유저",
    companyName: "테스트 크루",
    image: "https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/together-dallaem/1749456326143.webp",
    createdAt: "2025-06-09T08:04:42.482Z",
    updatedAt: "2025-06-09T08:05:26.264Z"
};

/** 로그인 유효성 검증 */
export const validCredentials = {
    email: "test@meetmeet.com",
    password: "123789@a",
    name: "테스트 유저",
    companyName: "테스트 크루"
};