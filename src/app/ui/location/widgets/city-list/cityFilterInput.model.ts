export class CityFilterInput{
      id:string|null="";
      name: string = "";
  regnId: string = "";
  cntryId: string = "";
  stateId: string = "";
        
  constructor(id: string|null, name: string, stateId: string, regnId: string, cntryId:string){
          this.id=id;
          this.name = name;
          this.stateId = stateId;
          this.regnId = regnId;
          this.cntryId = cntryId;
      }
}
