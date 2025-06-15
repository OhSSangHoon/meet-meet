/** 이름 길이가 너무 길 경우 생략 처리하는 함수
 * @param name 이름 (유저 이름, 크루 이름)
 * @param maxLength 최대 길이
 * @returns 생략 처리된 이름
 */
export const shortenName = (name: string, maxLength: number) => {
    if (name.length <= maxLength) return name;
    else return name.slice(0, maxLength) + '...';
}