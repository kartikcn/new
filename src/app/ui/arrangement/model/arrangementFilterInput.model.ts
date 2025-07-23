export class ArrangementFilterInputDTO{
    arrangementType:string="";
    description: string = "";
    arrangementId: number|null = 0;
    name: string = "";
    
  constructor(arrangementType: string, description: string, name:string,arrangementId:number|null){
      this.arrangementType=arrangementType;
      this.description = description;
      this.arrangementId = arrangementId;
      this.name = name;
      
  }
}
