/**
 * 리뷰 쿼리
 * @method all 리뷰 쿼리 전체
 * @method infinite 무한스크롤 쿼리
 */
export const reviewsQuery = {
    all: () => ['reviews'] as const,
    infinite: (
        mainType?: string,
        location?: string,
        date?: string,
        sortBy?: string,
        sortOrder?: string,
        startPage?: number
    ) => [...reviewsQuery.all(), 'infinite', { mainType, location, date, sortBy, sortOrder, startPage }] as const,
}