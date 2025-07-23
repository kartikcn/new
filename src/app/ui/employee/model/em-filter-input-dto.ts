export class EmpFilterInput{
    emCode:string|null="";
    firstName:string="";
    
    
    constructor(emCode: string|null, name: string){
            this.emCode=emCode;
            this.firstName=name;
            
    }
}

