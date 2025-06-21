import { http, HttpResponse } from "msw";

export const gatheringHandlers = [
    http.get('*/gatherings', ({ request }) => {
        const url = new URL(request.url);
        const sortBy = url.searchParams.get('sortBy');
        const sortOrder = url.searchParams.get('sortOrder');

        if (sortBy === 'participantCount' && sortOrder === 'desc') {
            return HttpResponse.json([
                {
                    teamId: '6-present',
                    id: 2942,
                    type: 'OFFICE_STRETCHING',
                    name: 'SUMIN 게릴라 콘서트로 초대합니다',
                    dateTime: '2025-07-28T09:30:00.000Z',
                    registrationEnd: '2025-07-21T14:55:00.000Z',
                    location: '홍대입구',
                    participantCount: 15,
                    capacity: 20,
                    image: 'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/together-dallaem/1750224305732_%C3%A1%C2%84%C2%86%C3%A1%C2%85%C2%B5%C3%A1%C2%84%C2%82%C3%A1%C2%85%C2%B5%C3%A1%C2%84%C2%89%C3%A1%C2%85%C2%B5%C3%A1%C2%84%C2%85%C3%A1%C2%85%C2%B5%C3%A1%C2%84%C2%8C%C3%A1%C2%85%C2%B3%202.jpg',
                    createdBy: 1979,
                    canceledAt: null
                },
                {
                    teamId: '6-present',
                    id: 2696,
                    type: 'WORKATION',
                    name: '독서스터디구합니다.',
                    dateTime: '2025-07-10T12:00:00.000Z',
                    registrationEnd: '2025-06-25T12:00:00.000Z',
                    location: '건대입구',
                    participantCount: 10,
                    capacity: 15,
                    image: 'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/together-dallaem/1749458878314_%C3%AB%C2%8F%C2%85%C3%AC%C2%84%C2%9C%C3%AC%C2%8A%C2%A4%C3%AD%C2%84%C2%B0%C3%AB%C2%94%C2%94.jpg',
                    createdBy: 1885,
                    canceledAt: null
                },
                {
                    teamId: '6-present',
                    id: 2747,
                    type: 'OFFICE_STRETCHING',
                    name: '야호',
                    dateTime: '2025-07-10T00:00:00.000Z',
                    registrationEnd: '2025-07-02T00:00:00.000Z',
                    location: '을지로3가',
                    participantCount: 8,
                    capacity: 10,
                    image: 'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/together-dallaem/1749536596912_velociraptors-8779404_1280.jpg',
                    createdBy: 1923,
                    canceledAt: null
                },
                {
                    teamId: '6-present',
                    id: 2902,
                    type: 'MINDFULNESS',
                    name: '뺨때리기 1vs1 하시죠',
                    dateTime: '2025-07-05T12:00:00.000Z',
                    registrationEnd: '2025-06-30T14:55:00.000Z',
                    location: '신림',
                    participantCount: 5,
                    capacity: 8,
                    image: 'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/together-dallaem/1750049333096_%C3%A1%C2%84%C2%88%C3%A1%C2%85%C2%A3%C3%A1%C2%84%C2%86%C3%A1%C2%85%C2%A1%C3%A1%C2%84%C2%83%C3%A1%C2%85%C2%A1%C3%A1%C2%84%C2%80%C3%A1%C2%85%C2%AE.jpg',
                    createdBy: 1944,
                    canceledAt: null
                },
                {
                    teamId: '6-present',
                    id: 2999,
                    type: 'MINDFULNESS',
                    name: '과거 모임 (필터링 될 것)',
                    dateTime: '2025-06-20T12:00:00.000Z',
                    registrationEnd: '2025-06-19T12:00:00.000Z',
                    location: '강남',
                    participantCount: 20,
                    capacity: 25,
                    image: 'https://example.com/image.jpg',
                    createdBy: 2000,
                    canceledAt: null
                }
            ]);
        }
    }),
];