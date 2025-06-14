'use client';
interface PageConverterProps {
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
}

const ARROW_BUTTON_STYLE = 'size-8 flex items-center justify-center text-gray-500 transition';

/** 모임 상세 페이지 리뷰 페이지 변환 버튼 */
export default function PageConverter({ page, setPage, totalPages }: PageConverterProps) {

    return (
        <div className="flex justify-center items-center gap-2 mt-4">
            <button
                className={ARROW_BUTTON_STYLE}
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
            >〈</button>
            {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                    key={idx}
                    className={`size-8 flex items-center justify-center rounded-full border ${page === idx + 1 ? 'border-main-500 bg-main-500 text-white font-bold' : 'border-gray-300 bg-white text-gray-500 hover:bg-main-100 transition'}`}
                    onClick={() => setPage(idx + 1)}
                >{idx + 1}</button>
            ))}
            <button
                className={ARROW_BUTTON_STYLE}
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
            >〉</button>
        </div>
    )
}