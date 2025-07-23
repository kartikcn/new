export class UserPwdReset{
        userEmail:string="";
        url:string="";

        constructor(values: object = {}) {
                Object.assign(this, values);
        }
}