export class PaginationObj {
    pageNo:number = 0;
    pageSize:number = 0;
    sortBy:string[] = [];
    sortOrder:string = '';
  
    constructor(pageNo:number, pageSize:number,sortBy:string[],sortOrder:string) {
      this.pageNo = pageNo;
      this.pageSize = pageSize;
      this.sortBy = sortBy;
      this.sortOrder = sortOrder;
    }
  }
  