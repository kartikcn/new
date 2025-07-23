export class UserFilterInput{
        id:string="";
        name: string = "";
        userRole: string = '';
        status?: number|null
        
        constructor(id: string, name: string, role: string,status: number|null){
                this.id=id;
                this.name=name;
                this.userRole= role;
                this.status = status
        }
}