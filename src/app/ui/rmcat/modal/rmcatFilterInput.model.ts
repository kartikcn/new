export class RmcatFilterInput{
    rmCat:string="";
    rmCatDesc: string = "";
    
    constructor(id: string, name: string){
            this.rmCat=id;
            this.rmCatDesc=name
    }
}