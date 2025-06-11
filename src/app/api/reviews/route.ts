import { NextRequest, NextResponse } from 'next/server';
import { EXTERNAL_PATHS } from '@/lib/api/apiPaths';
import { handleApiError } from '@/lib/api/handleApiError';
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
    return handleApiError(error);
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
    return handleApiError(error);
  }
}