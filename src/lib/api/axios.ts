import axios from 'axios';

/**
 * axios 클라이언트 인스턴스
 * @param baseURL - API 기본 URL
 * @param withCredentials - 쿠키 포함 여부
 * @warning 외부 경로에는 사용하지 말 것
 */
export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URI,
    withCredentials: true,
});

// 요청 인터셉터: headers에 토큰 추가
apiClient.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) config.headers['Authorization'] = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터: 에러 메세지, 에러 코드 parsing 후 반환
apiClient.interceptors.response.use(
    response => response,
    error => {
        const message = parseAxiosError(error);
        error.parsedMessage = message;
        error.parsedStatus = error?.response?.status ?? null;
        return Promise.reject(error);
    }
);

// 에러 메세지 파싱
const parseAxiosError = (error: unknown, message = '요청 중 에러가 발생했습니다.') => {
    if (axios.isAxiosError(error)) {
        const serverError = error?.response?.data?.error;
        if (serverError && typeof serverError === 'object' && 'message' in serverError) return serverError.message;
        if (error?.response?.data?.message) return error.response.data.message;
    }
    return message;
}

/**
 * axios 서버 인스턴스
 * @param baseURL - 기본 URL
 * @param withCredentials - 쿠키 포함 여부
 * @warning 외부 경로에는 사용하지 말 것
 */
export const apiServer = axios.create({
    baseURL: process.env.API_URI_DEV,
    withCredentials: true,
});