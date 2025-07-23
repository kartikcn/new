export class RegnFilterInput{
    id:string="";
    name: string = "";
    cntryId: string = "";
        
    constructor(id: string, name: string, cntryId:string){
      this.id=id;
      this.name = name;
      this.cntryId = cntryId
    }
}
