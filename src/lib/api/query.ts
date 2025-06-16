export const queryKeys = {
    gatherings: {
        infinite: () => ['gatherings', 'infinite'],
        detail: (id: string | number) => ['gatheringDetail', id],
        reviews: (id: string | number) => ['gatheringReviews', id],
        checkJoined: () => ['checkGatheringJoined'],
    },
    savedGatherings: () => ['savedGatherings'],
    allReviews: (
        filter?: string,
        selectedLocation?: string,
        selectedDate?: string,
        sortBy?: string
    ) => ['allReviews', filter, selectedLocation, selectedDate, sortBy],
    myPage: {
        joinedGatherings: (token: string) => ['joinedGatherings', token],
        createdGatherings: (token: string) => ['createdGatherings', token],
        myReviews: () => ['myReviews'],
    },
};