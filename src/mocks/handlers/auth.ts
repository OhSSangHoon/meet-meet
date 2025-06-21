import { SignInRequest, SignUpRequest } from '@/types/auth';
import { http, HttpResponse } from "msw";
import { mockUser, validCredentials } from '@/mocks/data/auth';

const registeredUsers = new Map<string, { password: string; name: string; companyName: string }>();

export const authHandlers = [
    http.post('/auth/signup', async ({ request }) => {
        const body = await request.json() as SignUpRequest;

        if (!body.email) return HttpResponse.json({ message: "유효한 이메일을 제공해야 합니다." }, { status: 400 });
        if (!body.password) return HttpResponse.json({ message: "유효한 비밀번호를 제공해야 합니다." }, { status: 400 });
        if (!body.name) return HttpResponse.json({ message: "유효한 이름을 제공해야 합니다." }, { status: 400 });
        if (!body.companyName) return HttpResponse.json({ message: "유효한 크루명을 제공해야 합니다." }, { status: 400 });
        if (body.email === "test@meetmeet.com") return HttpResponse.json({ message: "이미 존재하는 이메일입니다." }, { status: 409 });

        registeredUsers.set(body.email, {
            password: body.password,
            name: body.name,
            companyName: body.companyName
        });

        return HttpResponse.json({ message: "사용자 생성 성공" }, { status: 201 });
    }),

    http.post('/auth/signin', async ({ request }) => {
        const body = await request.json() as SignInRequest;

        // 유효성 검증용 계정
        if (body.email === validCredentials.email) {
            if (body.password !== validCredentials.password) return HttpResponse.json({ message: "비밀번호가 아이디와 일치하지 않습니다." }, { status: 401 });
            return HttpResponse.json({ token: 'test-access-token' }, { status: 200 });
        }

        // 새로 회원가입한 계정
        const registeredUser = registeredUsers.get(body.email);
        if (registeredUser) {
            if (body.password !== registeredUser.password) return HttpResponse.json({ message: "비밀번호가 아이디와 일치하지 않습니다." }, { status: 401 });
            return HttpResponse.json({ token: 'test-access-token' }, { status: 200 });
        }

        return HttpResponse.json({ message: "존재하지 않는 아이디입니다." }, { status: 404 });
    }),

    http.get('/auth/user', ({ request }) => {
        const authHeader = request.headers.get('Authorization');

        if (!authHeader || !authHeader.includes('test-access-token')) return HttpResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
        return HttpResponse.json(mockUser);
    }),

    http.post('/auth/signout', () => {
        return HttpResponse.json({ message: "로그아웃 성공" }, { status: 200 });
    }),

    http.put('/auth/user', async ({ request }) => {
        const authHeader = request.headers.get('Authorization');

        if (!authHeader || !authHeader.includes('test-access-token')) return HttpResponse.json({ message: "인증이 필요합니다." }, { status: 401 });

        const body = await request.json() as { name: string; companyName: string; image?: string };

        if (!body.companyName) return HttpResponse.json({ message: "유효한 크루명을 제공해야 합니다." }, { status: 400 });
        if (!body.image) return HttpResponse.json({ message: "유효한 이미지 파일을 제공해야 합니다." }, { status: 400 });

        return HttpResponse.json({
            ...mockUser,
            companyName: body.companyName || mockUser.companyName,
            image: body.image || mockUser.image,
            updatedAt: new Date().toISOString()
        });
    }),
];