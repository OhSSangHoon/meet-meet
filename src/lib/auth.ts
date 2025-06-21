import { SignInRequest, SignUpRequest, UpdateUserProfileRequest } from '@/types/auth';
import axios from 'axios';

/** 인증 로직 테스트를 위한 클래스(AuthProvider 검증 대체) 
 * @method signUp
 * @method signIn
 * @method fetchUser
 * @method signOut
 * @method updateUserProfile
*/
export class Authentication {
    /** 회원가입
     * @param email - 이메일
     * @param password - 비밀번호
     * @param name - 닉네임
     * @param companyName - 회사명
     * @returns {message, token, status}
     */
    static async signUp({ email, password, name, companyName }: SignUpRequest) {
        if (!email || !password || !name || !companyName) throw new Error('이메일, 비밀번호, 닉네임, 회사명은 필수 입력입니다.');

        try {
            const signUpResult = await axios.post('/auth/signup', {
                email,
                password,
                name,
                companyName
            });

            if (signUpResult.status === 200 || signUpResult.status === 201) {
                const signInResult = await this.signIn({ email, password });
                return { ...signUpResult.data, ...signInResult };
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) throw new Error(error.response.data.message);
            throw new Error('회원가입 실패');
        }
    }

    /** 로그인
     * @param email - 이메일
     * @param password - 비밀번호
     * @returns {토큰, status}
     */
    static async signIn({ email, password }: SignInRequest) {
        if (!email || !password) throw new Error('이메일과 비밀번호는 필수입니다.');

        try {
            const result = await axios.post('/auth/signin', { email, password });

            if (result.status === 200) {
                localStorage.setItem('token', result.data.token);
                await this.fetchUser(result.data.token);
                return result.data;
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) throw new Error(error.response.data.message || '로그인 실패');
            throw new Error('로그인 실패');
        }
    }

    /** 유저 정보 조회
     * @param token - 토큰
     * @returns {유저 정보, status}
     */
    static async fetchUser(token: string) {
        if (!token) throw new Error('토큰이 필요합니다.');

        try {
            const result = await axios.get('/auth/user', { headers: { Authorization: `Bearer ${token}` } });

            if (result.status === 200) return result.data; // mockUser
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) throw new Error(error.response.data.message || '유저 정보 조회 실패');
            throw new Error('유저 정보 조회 실패');
        }
    }

    /** 로그아웃
     * @returns {message, status}
     */
    static async signOut() {
        try {
            await axios.post('/auth/signout');
            return { message: "로그아웃 성공" };
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) throw new Error(error.response.data.message || '로그아웃 실패');
            throw new Error('로그아웃 실패');
        }
    }

    /** 유저 정보 수정
     * @param token - 토큰
     * @param data - 유저 정보 수정 데이터
     * @returns {유저 정보, status}
     */
    static async updateUserProfile(token: string, data: UpdateUserProfileRequest) {
        if (!token) throw new Error('토큰이 필요합니다');

        try {
            const result = await axios.put('/auth/user', data, { headers: { Authorization: `Bearer ${token}` } });

            if (result.status === 200) return result.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) throw new Error(error.response.data.message || '프로필 업데이트 실패');
            throw new Error('프로필 업데이트 실패');
        }
    }
}
