import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

/**
 * 리뷰 목록 조회
 * @param 옵션
 * @method GET
 * @returns 모임 리뷰 목록
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const response = await axios.get(`${process.env.API_URI_DEV}/reviews`, {
      params: Object.fromEntries(searchParams),
      headers: {
        Authorization: request.headers.get('Authorization') || '',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('리뷰 목록 조회 중 오류:', error);

    if (axios.isAxiosError(error) && error.response) return NextResponse.json(error.response.data, { status: error.response.status });

    return NextResponse.json(
      { code: 'SERVER_ERROR', message: '리뷰 목록 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 리뷰 생성
 * @param 리뷰 아이디, 평점, 코멘트
 * @method POST
 * @returns 생성된 리뷰 데이터 또는 에러 메시지
 */
export async function POST(request: NextRequest) {
  try {
    const { gatheringId, score, comment } = await request.json();

    const response = await axios.post(
      `${process.env.API_URI_DEV}/reviews`,
      { gatheringId, score, comment },
      { headers: { Authorization: request.headers.get('Authorization') } }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('리뷰 생성 중 오류:', error);

    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, { status: error.response.status });
    }

    return NextResponse.json(
      { code: 'SERVER_ERROR', message: '리뷰 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}