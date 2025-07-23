export class UserScreenInput{
        compId:number=0;
        userRole:string="";

        constructor(values: object = {}) {
                Object.assign(this, values);
        }
}