import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

/**
 * 모임 취소
 * @param request 
 * @method PUT
 * @returns 성공 메세지
 */
export async function PUT(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const token = request.headers.get('Authorization');
    console.log(token);

    try {
        if (!id) {
            return NextResponse.json(
                { error: '모임 id가 필요합니다.' },
                { status: 400 }
            );
        }

        const response = await axios.put(`${process.env.API_URI_DEV}/gatherings/${id}/cancel`,
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