import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const response = await axios.get(`${process.env.API_URI_DEV}/gatherings/joined`, {
        params: Object.fromEntries(searchParams),
        headers: {
            'Authorization': request.headers.get('Authorization') || '',
        },
    });

    return NextResponse.json(response.data);
} catch (error) {
    console.error('API 요청 중 오류 발생:', error);

    if(axios.isAxiosError(error)) {
        if (error.response) {
            console.error('서버 응답 상태:', error.response.status);
            console.error('서버 응답 데이터:', error.response.data);
            return NextResponse.json(
                error.response.data,
                { status: error.response.status || 500 }
            );
        } else if (error.request) {
            console.error('요청만 됨, 응답 없음');
            return NextResponse.json(
                { code: 'SERVER_ERROR', message: '서버에서 응답이 없습니다.' },
                { status: 500 }
            );
        } else {
            console.error('요청 설정 중 오류:', error.message);
            return NextResponse.json(
                { code: 'REQUEST_ERROR', message: error.message || '요청 중 오류가 발생했습니다.' },
                { status: 500 }
            );
        }
    }
    return NextResponse.json(
        { code: 'SERVER_ERROR', message: '서버에서 응답이 없습니다.' },
        { status: 500 }
    );
}
}
