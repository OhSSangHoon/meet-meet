/** 텍스트에 특수문자 치환 */
export const cleanXSS = (text: string) => {
    return text.replaceAll("<", "&lt;").replaceAll(">", "&gt;")
        .replaceAll("\\(", "& #40;").replaceAll("\\)", "& #41;")
        .replaceAll("'", "& #39;")
        .replaceAll("eval\\((.*)\\)", "")
        .replaceAll("[\\\"\\\'][\\s]*javascript:(.*)[\\\"\\\']", "\"\"")
        .replaceAll("script", "");
}