import axios from "axios";
import { Gathering } from "../../types/gatherings";


export const fetchGatheringsPaginated = async () => {
    const token = localStorage.getItem('token');

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URI}/api/gatherings`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });

    return response.data || [];
};

export const fetchGatherings = async (): Promise<Gathering[]> => {
    const token = localStorage.getItem('token');
    const response = await axios.get('/api/gatherings', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    return response.data;
};

export const getSavedGatherings = (): string[] => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('savedGatherings') || '[]');
};

export const setSavedGatherings = (ids: string[]): void => {
    localStorage.setItem('savedGatherings', JSON.stringify(ids));
};