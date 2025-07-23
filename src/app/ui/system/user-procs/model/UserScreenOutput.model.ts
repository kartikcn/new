export class UserScreenOutput{
        userScreensNum:number=0;
        compId:number=0;
        userRole:string="";
        screenNum:number=0;
        processId:string="";
        subProcessId:string="";

        constructor(values: object = {}) {
                Object.assign(this, values);
        }
}