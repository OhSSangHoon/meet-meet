import { NextRequest, NextResponse } from 'next/server';
import { externalClient } from '@/lib/api/clientFetchers';
import { EXTERNAL_PATHS } from '@/lib/api/apiPaths';
import { handleApiError } from '@/lib/api/handleApiError';

/**
 * 유저 정보 조회
 * @header Authorization - 토큰
 * @method GET
 * @returns 유저 정보
 */
export async function GET(request: NextRequest) {
  const token = request.headers.get('Authorization');

  if (!token) return new NextResponse(JSON.stringify({ error: '토큰이 필요합니다' }), { status: 401 });

  try {
    const response = await externalClient.get(EXTERNAL_PATHS.USER, { headers: { Authorization: token! } });
    return new NextResponse(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * 유저 정보 수정
 * @param request - 회사명, 프로필 이미지
 * @header Authorization - 토큰
 * @method PUT
 * @returns 변경된 유저 정보
 */
export async function PUT(request: NextRequest) {
  const token = request.headers.get('Authorization');

  if (!token) return new NextResponse(JSON.stringify({ error: '토큰이 필요합니다' }), { status: 401 });

  try {
    const formData = await request.formData();
    const companyName = formData.get('companyName') as string;
    const imageFile = formData.get('image') as File;

    const serverFormData = new FormData();
    serverFormData.append('companyName', companyName);
    if (imageFile && imageFile.size > 0) serverFormData.append('image', imageFile);

    const response = await externalClient.put(EXTERNAL_PATHS.USER, serverFormData, { headers: { Authorization: token! } });

    return new NextResponse(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    return handleApiError(error)
  }
}
