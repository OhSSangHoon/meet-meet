import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

export async function POST() {
    try {
        const response = await axios.post(`${process.env.API_URI_DEV}/auths/signout`,
            `${process.env.API_URI_DEV}`
        )
        return new NextResponse(JSON.stringify(response.data), { status: 200 });
    } catch (error) {
        const err = error as AxiosError;
        return new NextResponse(JSON.stringify({ error: err?.response?.data }), { status: 500 });
    }
}

