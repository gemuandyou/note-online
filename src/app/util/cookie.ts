/**
 * Cookie相关操作
 * Created by Gemu on 2017/6/11.
 */
export class Cookie {

    /**
     * 设置cookie
     * @param cname cookie名
     * @param cvalue  cookie值
     * @param exdays 过期时间（天）
     */
    static setCookie(cname, cvalue, exdays): void {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        const expires = 'expires=' + d.toUTCString();
        document.cookie = cname + '=' + cvalue + '; ' + expires;
    }
    /**
     * 获取cookie
     * @param cname cookie名
     */
    static getCookie(cname): string {
        const name = cname + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) !== -1) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    }
    /**
     * 清除cookie
     * @param name cookie名
     */
    static clearCookie(name): void {
        this.setCookie(name, '', -1);
    }

}
