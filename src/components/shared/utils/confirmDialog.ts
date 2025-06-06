/**
 * ConfirmDialog의 상태(열림/닫힘, 메시지, 확인 콜백)를 하나의 객체로 관리하는 타입
 * @type {boolean} open 모달이 열려 있는지 여부 (true: 열림, false: 닫힘)
 * @type {string} text 모달에 표시할 메시지(텍스트)
 * @type {function} onConfirm 확인 버튼 클릭 시 실행할 콜백 함수
 */
export interface ConfirmDialogState {
    isOpen: boolean;
    text: string;
    onConfirm?: () => void;
}

/**
 * ConfirmDialog를 열기 위한 헬퍼 함수
 * @param setDialog 모달 상태를 관리하는 함수
 * @param text 모달에 표시할 메시지(텍스트)
 * @param onConfirm 확인 버튼 클릭 시 실행할 콜백 함수
 */
export function openConfirmDialog(
    setDialog: React.Dispatch<React.SetStateAction<ConfirmDialogState>>,
    text: string,
    onConfirm?: () => void
) {
    setDialog({ isOpen: true, text, onConfirm });
}