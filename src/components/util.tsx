function containsChinese(text: string): boolean {
    const chineseRegex = /[\u4e00-\u9fa5]/; // 匹配中文字符的正则表达式
    return chineseRegex.test(text); // 使用正则表达式的 test 方法检查字符串中是否包含中文字符
}

export {containsChinese};
