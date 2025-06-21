/** 로그인 - 로그인 요청 */
export interface SignInRequest {
    email: string;
    password: string;
}

/** 로그인 - 로그인 응답 */
export interface SignInResponse {
    token: string;
}

/** 회원가입 - 회원가입 요청 */
export interface SignUpRequest {
    email: string;
    password: string;
    name: string;
    companyName: string;
}

/** 로그인, 회원가입 - 유저 정보 조회 응답 */
export interface UserResponse {
    teamId: string;
    id: number;
    email: string;
    name: string;
    companyName: string;
    image: string;
    createdAt: string;
    updatedAt: string;
}

/** 마이페이지, 프로필 저장 - 프로필 수정 요청 */
export interface UpdateUserProfileRequest {
    companyName: string;
    image: string;
}