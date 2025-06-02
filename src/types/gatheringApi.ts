/**
 * 모임 API 파라미터
 * @type {string | null} token 토큰
 * @type {function} onCallback 모달에 표시할 메세지를 전달, 모달 확인 시 실행할 함수를 전달
*/
export interface GatheringApiParams {
    token: string | null;
    onCallback?: (msg: string, onConfirm?: () => void) => void;
}