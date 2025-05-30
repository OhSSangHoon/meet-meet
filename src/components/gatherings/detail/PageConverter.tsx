export default function PageConverter({ page, setPage, totalPages }: { page: number, setPage: (page: number) => void, totalPages: number }) {
    return (
        <div className="flex justify-center items-center gap-2 mt-4">
            <button
                className="w-8 h-8 flex items-center justify-center text-gray-500 transition"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
            >〈</button>
            {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                    key={idx}
                    className={`w-8 h-8 flex items-center justify-center rounded-full border ${page === idx + 1 ? 'border-main-500 bg-main-500 text-white font-bold' : 'border-gray-300 bg-white text-gray-500 hover:bg-main-100 transition'}`}
                    onClick={() => setPage(idx + 1)}
                >{idx + 1}</button>
            ))}
            <button
                className="w-8 h-8 flex items-center justify-center text-gray-500 transition"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
            >〉</button>
        </div>
    )
}