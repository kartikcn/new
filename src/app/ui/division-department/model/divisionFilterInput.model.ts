export class DivisionFilterInputDTO{
    divId:string;
    description: string;
    divHead: string ;
    
  constructor(divId: string, description: string, divHead:string){
      this.divId=divId;
      this.description = description;
      this.divHead = divHead;
  }
}
