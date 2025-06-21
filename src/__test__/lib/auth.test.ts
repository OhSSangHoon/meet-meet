import { describe, test, expect } from 'vitest';
import { Authentication } from '@/lib/auth';
import { validCredentials, mockUser } from '@/mocks/data/auth';
import { signInFormSchema, signUpFormSchema } from '@/utils/auth/authSchema';

describe('Authentication 검증', () => {
    describe('회원가입 검증', () => {
        test('유효성 검사 만족 & 회원가입 성공하면 로그인까지 되어야 한다.', async () => {
            const data = {
                email: 'newuser@example.com',
                password: 'validpass123!',
                name: '새로운 유저',
                companyName: '새로운 크루'
            };

            const validationResult = signUpFormSchema.safeParse(data);
            expect(validationResult.success).toBe(true);

            const result = await Authentication.signUp(data);
            expect(result.message).toBe('사용자 생성 성공');
            expect(result.token).toBe('test-access-token');
        });

        test('유효성 검사 만족 & 이미 존재하는 이메일로 회원가입하면 에러가 터져야 한다.', async () => {
            const data = {
                email: 'test@meetmeet.com',
                password: 'validpass123!',
                name: '새로운 유저',
                companyName: '새로운 크루'
            };

            const validationResult = signUpFormSchema.safeParse(data);
            expect(validationResult.success).toBe(true);

            await expect(Authentication.signUp(data)).rejects.toThrow('이미 존재하는 이메일입니다.');
        });

        test('이메일을 입력하지 않으면 유효성 검사를 실패해야 한다.', async () => {
            const data = {
                email: '',
                password: '129319',
                name: '새로운 유저',
                companyName: '새로운 크루'
            }
            const validationResult = signUpFormSchema.safeParse(data);
            expect(validationResult.success).toBe(false);
        });

        test('이메일 형식이 맞지 않으면 유효성 검사를 실패해야 한다.', () => {
            const data = {
                email: 'wrongemail@withoutcom',
                password: 'validpass123!',
                name: '새로운 유저',
                companyName: '새로운 크루'
            }
            const validationResult = signUpFormSchema.safeParse(data);
            expect(validationResult.success).toBe(false);
        });

        test('패스워드가 8자 미만이면 유효성 검사를 실패해야 한다.', async () => {
            const data = {
                email: 'new@email.com',
                password: '129319',
                name: '새로운 유저',
                companyName: '새로운 크루'
            }
            const validationResult = signUpFormSchema.safeParse(data);
            expect(validationResult.success).toBe(false);
        });

        test('패스워드가 영문 소문자, 숫자, 특수문자를 모두 포함하지 않으면 유효성 검사를 실패해야 한다.', async () => {
            const data = {
                email: 'new@email.com',
                password: '1293191231',
                name: '새로운 유저',
                companyName: '새로운 크루'
            }
            const validationResult = signUpFormSchema.safeParse(data);
            expect(validationResult.success).toBe(false);
        });

        test('이름을 입력하지 않으면 유효성 검사를 실패해야 한다.', async () => {
            const data = {
                email: 'new@email.com',
                password: '129319',
                name: '',
                companyName: '새로운 크루'
            }
            const validationResult = signUpFormSchema.safeParse(data);
            expect(validationResult.success).toBe(false);
        });

        test('회사명을 입력하지 않으면 유효성 검사를 실패해야 한다.', async () => {
            const data = {
                email: 'new@email.com',
                password: '129319',
                name: '',
                companyName: '새로운 크루'
            }
            const validationResult = signUpFormSchema.safeParse(data);
            expect(validationResult.success).toBe(false);
        });
    })

    describe('로그인 검증', () => {
        test('유효한 이메일과 패스워드를 입력하면 로그인에 성공해야 한다.', async () => {
            const result = await Authentication.signIn(
                {
                    email: validCredentials.email,
                    password: validCredentials.password
                }
            );

            expect(result.token).toBe('test-access-token');
        });

        test('잘못된 이메일로 로그인하면 에러가 터져야 한다.', async () => {
            await expect(Authentication.signIn(
                {
                    email: 'wrong@email.com',
                    password: validCredentials.password
                })).rejects.toThrow('존재하지 않는 아이디입니다.');
        });

        test('잘못된 비밀번호로 로그인하면 에러가 터져야 한다', async () => {
            await expect(Authentication.signIn(
                {
                    email: validCredentials.email,
                    password: 'wrongpassword'
                }
            )).rejects.toThrow('비밀번호가 아이디와 일치하지 않습니다.');
        });

        test('이메일 형식이 맞지 않으면 유효성 검사를 실패해야 한다.', () => {
            const data = {
                email: 'wrongemail@withoutcom',
                password: 'validpass123!'
            }

            const validationResult = signInFormSchema.safeParse(data);
            expect(validationResult.success).toBe(false);
            if (!validationResult.success) expect(validationResult.error.issues[0].message).toBe('올바른 이메일 형식이 아닙니다.');
        })

        test('패스워드가 8자 미만이면 유효성 검사를 실패해야 한다.', async () => {
            const data = {
                email: 'test@meetmeet.com',
                password: '129319',
            };

            const validationResult = signInFormSchema.safeParse(data);
            expect(validationResult.success).toBe(false);
            if (!validationResult.success) expect(validationResult.error.issues[0].message).toBe('비밀번호는 8자 이상이어야 합니다.');
        });
    });

    describe('유저 정보 조회 검증', () => {
        test('유효한 토큰을 헤더에 담아 전송하면 유저 정보를 반환해야 한다.', async () => {
            const result = await Authentication.fetchUser('test-access-token');

            expect(result).toEqual(mockUser);
            expect(result.id).toBe(mockUser.id);
            expect(result.email).toBe(mockUser.email);
            expect(result.name).toBe(mockUser.name);
            expect(result.companyName).toBe(mockUser.companyName);
        });

        test('유효하지 않은 토큰을 헤더에 담아 전송하면 에러가 터져야 한다.', async () => {
            await expect(Authentication.fetchUser('invalid-token')).rejects.toThrow('인증이 필요합니다.');
        });

        test('토큰 없이 요청하면 에러가 터져야 한다.', async () => {
            await expect(Authentication.fetchUser('')).rejects.toThrow('토큰이 필요합니다.');
        });
    });

    describe('로그아웃 검증', () => {
        test('로그아웃에 성공해야 한다', async () => {
            const result = await Authentication.signOut();

            expect(result.message).toBe('로그아웃 성공');
        });
    });

    describe('프로필 수정 검증', () => {
        test('유효한 토큰을 헤더에 담고 유효한 데이터를 전송하면 프로필 수정에 성공해야 한다.', async () => {
            const updateData = {
                companyName: '업데이트된 크루',
                image: 'https://example.com/new-image.jpg'
            };

            const result = await Authentication.updateUserProfile('test-access-token', updateData);

            expect(result.companyName).toBe(updateData.companyName);
            expect(result.image).toBe(updateData.image);
            expect(result.updatedAt).toBeDefined();
        });

        test('유효하지 않은 토큰을 헤더에 담고 유효한 데이터를 전송하면 에러가 터져야 한다.', async () => {
            const updateData = {
                companyName: '업데이트된 크루',
                image: 'https://example.com/new-image.jpg'
            };

            await expect(Authentication.updateUserProfile('invalid-token', updateData)).rejects.toThrow('인증이 필요합니다.');
        });

        test('크루명을 포함하지 않고 전송하면 에러가 터져야 한다.', async () => {
            const updateData = {
                companyName: '',
                image: 'http://example.com/image.jpg'
            };

            await expect(Authentication.updateUserProfile('test-access-token', updateData)).rejects.toThrow('유효한 크루명을 제공해야 합니다.');
        });

        test('이미지 파일을 포함하지 않고 전송하면 에러가 터져야 한다.', async () => {
            const updateData = {
                companyName: '업데이트된 크루',
                image: ''
            };

            await expect(Authentication.updateUserProfile('test-access-token', updateData)).rejects.toThrow('유효한 이미지 파일을 제공해야 합니다.');
        });
    });
})