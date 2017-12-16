export class CodeUtil {

	/**
	 * unicode解码
	 * @param code 解码前的字符串
	 * @return 解码后的字符串
	 * @deprecated
	 */
  static decodingUnicode(code: string): string {
		// return eval('\'' + code + '\'');
    return '【不支持】';
  }

	/**
	 * unicode编码
	 * @param code 编码前的字符串
	 * @return 编码后的字符串
	 */
  static encodingUnicode(code: string): string {
    let result = '';
    for (let i = 0; i < code.length; i++) {
      const character = code.charCodeAt(i).toString();
      result += '\\u' + character;
    }
    return result;
  }

}
