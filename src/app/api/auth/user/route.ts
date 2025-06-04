import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

/**
 * 유저 정보 조회
 * @method GET
 * @returns 유저 정보
 */
export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization');

  try {
    const response = await axios.get(`${process.env.API_URI_DEV}/auths/user`, { headers: { Authorization: token! } });
    return new NextResponse(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    const err = error as AxiosError;
    return new NextResponse(JSON.stringify({ error: err?.response?.data }), { status: 500 });
  }
}

/**
 * 유저 정보 수정
 * @param 회사명, 프로필 이미지
 * @method PUT
 * @returns 변경된 유저 정보
 */
export async function PUT(req: NextRequest) {
  const token = req.headers.get('Authorization');

  try {
    const formData = await req.formData();
    const companyName = formData.get('companyName') as string;
    const imageFile = formData.get('image') as File;

    // 서버로 전송할 FormData 생성
    const serverFormData = new FormData();
    serverFormData.append('companyName', companyName);

    if (imageFile && imageFile.size > 0) {
      serverFormData.append('image', imageFile);
    }

    const response = await axios.put(
      `${process.env.API_URI_DEV}/auths/user`,
      serverFormData,
      { headers: { Authorization: token! } }
    );

    return new NextResponse(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    const err = error as AxiosError;
    return new NextResponse(JSON.stringify({ error: err?.response?.data }), { status: 500 });
  }
}
