import { create } from 'zustand';
import { Gathering } from '@/types/gatherings';

/**
 * SSR 모임 목록
 * @type {Gathering[]} gatherings 모임 목록
 * @type {number | null} currentGatheringId 현재 모임 ID
 * @type {function} setGatherings 모임 목록 설정 함수
 * @type {function} setCurrentGatheringId 현재 모임 ID 설정 함수
 * @type {function} removeGathering 모임 삭제 함수
 */
interface GatheringsState {
    gatherings: Gathering[];
    currentGatheringId: number | null;
    setGatherings: (gatherings: Gathering[]) => void;
    setCurrentGatheringId: (id: number) => void;
    removeGathering: (id: number) => void;
}

export const useGatheringsStore = create<GatheringsState>((set) => ({
    gatherings: [],
    currentGatheringId: null,
    setGatherings: (gatherings) => set({ gatherings }),
    setCurrentGatheringId: (id: number) => set({ currentGatheringId: id }),
    removeGathering: (id) =>
        set((state) => ({
            gatherings: state.gatherings.filter((g) => g.id !== id),
        })),
}));