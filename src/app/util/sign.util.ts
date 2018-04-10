export class SignUtil {

	/**
	 * URL特殊符号解码
	 * @param code 解码前的字符串
	 * @return 解码后的字符串
	 * @deprecated
	 */
  static decodingUrlSign(code: string): string {
    return code.replace('gemu+equal-sign+yifan', '=')
               .replace('gemu+semicolon+yifan', ';')
               .replace('gemu+and+yifan', '&')
               .replace('gemu+question+yifan', '?')
               .replace('gemu+anchor+yifan', '#');
  }

	/**
	 * URL特殊符号编码
	 * @param code 编码前的字符串
	 * @return 编码后的字符串
	 */
  static encodingUrlSign(code: string): string {
    return code.replace('=', 'gemu+equal-sign+yifan')
               .replace(';', 'gemu+semicolon+yifan')
               .replace('&', 'gemu+and+yifan')
               .replace('?', 'gemu+question+yifan')
               .replace('#', 'gemu+anchor+yifan');
  }

}
