export class Page {

    private _pageNo: number;
    private _size: number;

    constructor(pageNo: number, size: number) {
        this._pageNo = pageNo;
        this._size = size;
    }

    get pageStart(): number {
        if (this._pageNo && this._pageNo > 0 && this.pageSize) {
            return (this._pageNo - 1) * this.pageSize;
        }
        return;
    }

    get pageSize(): number {
        return this._size;
    }

    set pageNo(pageNo: number) {
        this._pageNo = pageNo;
    }

    set size(size: number) {
        this._size = size;
    }

    get pageNo(): number {
        return this._pageNo;
    }

}
