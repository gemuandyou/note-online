/*
 * 设置轮训任务
 * Created by gemu on 2017-10-14 11:14:33
 */
export class RollUtil {

    handle: any;
    private _maxMinute: number;

    /**
     * 轮训器
     * @param millisecond 轮训间隔，单位毫秒
     * @param maxMinute 最大轮训时间，单位分
     */
    constructor(private _millisecond: number, maxMinute?: number) {
        this._maxMinute = maxMinute;
    }

    /**
     * 开始轮训执行方法
     * @param fn 要被执行的方法
     * @return interval's handle
     */
    start(fn: Function, obj: any): any {
        this.handle = setInterval(() => {
            console.count();
            fn(obj);
        }, this._millisecond);
        if (this._maxMinute) {
            setTimeout(() => {
                clearInterval(this.handle);
            }, this._maxMinute * 60 * 1000);
        }
        return this.handle;
    }

    /**
     * 结束轮训
     */
    end(): void {
        clearInterval(this.handle);
    }

}
