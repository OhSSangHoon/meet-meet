import axios, { AxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { token } = await req.json();

    try {
        const response = await axios.get(
            `${process.env.API_URI_DEV}/auths/user`,
            {
                params: { teamId: `${process.env.TEAM_ID_DEV}` },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return new NextResponse(JSON.stringify(response.data), { status: 200 });
    } catch (error) {
        const err = error as AxiosError;
        return new NextResponse(JSON.stringify({ error: err?.response?.data }), { status: 500 });
    }
}