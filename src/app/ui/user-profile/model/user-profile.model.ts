export class UserProfile{
        userId:number|null = null;
        userName:string="";
        userRole:string="";
        employeeEmail:string="";
        name:string=""
        employeeGender:string="";
        employeeEmCode:string="";
        employeeEmStdEmStd:string="";
        blName:string="";
        flName:string="";
        rmName:string="";
        employeePhonePersonal!:number;
        employeePhoneWork!: number;
        employeeFaxNum!: number;
        employeeIdNumber!: number;
        initials:string="";
        emPhoto:any="";
        emEmployeeEmId:any



        constructor(values: object = {}) {
                Object.assign(this, values);
        }
}