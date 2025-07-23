export class UsersFilterInputDTO{
    id?:number|null;
    name: string = "";
    userRole: string = "";
    status: string = "";
    userName : string =""
    constructor(id: number|null, name: string, userRole: string,status:string){
            this.id=id;
            this.name=name;
            this.userRole= userRole;
            this.status = status;
    }
}