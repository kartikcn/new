export class StateFilterInput{
  id: string | null;
    name: string = "";
    regnId: string = "";
    cntryId: string = "";
        
    constructor(id: string|null, name: string, regnId:string,cntryId:string){
      this.id=id;
      this.name = name;
      this.regnId = regnId;
      this.cntryId = cntryId
    }
}
