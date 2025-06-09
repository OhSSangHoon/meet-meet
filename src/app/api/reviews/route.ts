import { NextRequest, NextResponse } from 'next/server';
import { EXTERNAL_PATHS } from '@/lib/api/apiPaths';
import axios, { AxiosError } from 'axios';
import { externalClient } from '@/lib/api/clientFetchers';

/**
 * 리뷰 목록 조회
 * @header Authorization - 토큰
 * @param request - 쿼리 (모임 ID, 유저 ID, ...)
 * @method GET
 * @returns 모임 리뷰 목록
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = request.headers.get('Authorization');

  try {
    const response = await externalClient.get(EXTERNAL_PATHS.REVIEWS, {
      params: Object.fromEntries(searchParams),
      headers: {
        Authorization: token!,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    const err = error as AxiosError;
    return new NextResponse(JSON.stringify({ error: err?.response?.data }), { status: 500 });
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

    const response = await externalClient.post(
      EXTERNAL_PATHS.REVIEWS,
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