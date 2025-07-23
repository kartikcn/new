export class RoomTypeFilterInputDTO{
    rmtypeId:number|null=0;
    name: string = "";
    rmcatId: number|null=0;
    
  constructor(rmtypeId: number|null, name: string, rmcatId:number|null=0){
      this.rmtypeId=rmtypeId;
      this.name = name;
      this.rmcatId = rmcatId;
  }
}
