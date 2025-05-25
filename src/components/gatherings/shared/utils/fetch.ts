import axios from "axios";
import { Gathering } from "@/types/gatherings";

/**
 * 페이지네이션된 모임 목록을 조회합니다.
 * @param page - 조회할 페이지 번호 
 * @param limit - 한 페이지당 조회할 모임 수
 * @returns {Promise<Array>} 모임 목록 배열
 */
export const fetchGatheringsPaginated = async (page: number, limit: number, token: string) => {
    
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URI}/api/gatherings`, {
        params: {
            offset: (page - 1) * limit,
            limit,
        },
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    
    return response.data || [];
};

/**
 * 전체 모임 목록을 조회합니다.
 * @param {string} token - 토큰
 * @returns {Promise<Gathering[]>} 모임 목록 배열
 */
export const fetchGatherings = async (token: string): Promise<Gathering[]> => {
    const response = await axios.get('/api/gatherings', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    return response.data;
};