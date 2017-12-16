export class Page {

  constructor(private pageNo: number, private size: number) {
  }

  get pageStart(): number {
    if (this.pageNo && this.pageNo > 0 && this.pageSize) {
      return (this.pageNo - 1) * this.pageSize;
    }
    return;
  }

  get pageSize(): number {
    return this.size;
  }

}
