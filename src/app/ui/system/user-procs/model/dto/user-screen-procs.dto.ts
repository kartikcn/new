import { UserScreenOutput } from "../UserScreenOutput.model";

export class UserSreenProcs{
        userProcs:UserScreenOutput[] =[];

        constructor(values: object = {}) {
                Object.assign(this, values);
        }
}