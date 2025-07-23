export class RmTypeFilterInputDTO{
        id:string="";
        name: string = "";
        rmCat: string = "";
        
      constructor(id: string, name: string, rmCat:string){
          this.id=id;
          this.name = name;
          this.rmCat = rmCat;
      }
}
