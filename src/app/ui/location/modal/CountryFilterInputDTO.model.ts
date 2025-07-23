export class CountryFilterInputDTO{
    id:string|null="";
    name: string = "";
    ctryCode:string=""
    constructor(id: string|null, name: string, ctryCode:string){
            this.id=id;
            this.name=name
            this.ctryCode=ctryCode
    }
}
