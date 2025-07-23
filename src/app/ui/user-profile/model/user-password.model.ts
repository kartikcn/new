export class UserPasswrodInputDto{
        userName:string="";
        userPwd:string="";
        userNewPwd!:string;
        userDatePwdChanged!:Date|string|null;

        constructor(values: object = {}) {
                Object.assign(this, values);
        }
}