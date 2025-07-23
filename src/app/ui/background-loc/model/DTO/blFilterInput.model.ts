export class BuildingFilterInput{
  id: string|null = "";
  name: string = "";
  siteId: string = "";
  compId: number = 0;
        
  constructor(id: string|null, name: string, siteId:string,compId:number){
            this.id=id;
          this.name = name;
          this.siteId = siteId;
          this.compId = compId;
        }
}
