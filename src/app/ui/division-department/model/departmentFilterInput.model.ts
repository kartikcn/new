export class DepartmentFilterInputDTO{
    depId:string="";
    description: string = "";
    depHead: string = "";
    divId:string="";
    
  constructor(depId: string, description: string, depHead:string,divId:string){
      this.depId=depId;
      this.description = description;
      this.depHead = depHead;
      this.divId = divId;
  }
}
