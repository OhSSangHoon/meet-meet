import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

/**
 * 모임 참여 
 * @param request 
 * @method DELETE
 * @returns 성공 메세지
 */
export async function POST(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const token = request.headers.get('Authorization');

    try {
        if (!id) {
            return NextResponse.json(
                { error: '모임 id가 필요합니다.' },
                { status: 400 }
            );
        }

        const response = await axios.post(`${process.env.API_URI_DEV}/gatherings/${id}/join`,
            {},
            {
                headers: {
                    'Authorization': token,
                },
            }
        );
        return new NextResponse(JSON.stringify(response.data), { status: 200 });
    } catch (error) {
        const err = error as AxiosError;
        return new NextResponse(JSON.stringify({ error: err?.response?.data }), { status: 500 });
    }
}