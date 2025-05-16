// 이메일 형식
export const regexEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// 영문, 숫자, 특수문자 각각 1개 이상 & 최소 8자 이상 입력
export const regexPassword = (password: string) => {
    const regex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return regex.test(password);
};
