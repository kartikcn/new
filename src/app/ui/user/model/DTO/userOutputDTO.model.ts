import { UserOutput } from '../userOutput.model';
import {EmployeeOutput} from '../employeOutput.model';


export class UserOutputDto{
        user!:UserOutput;
        employee: EmployeeOutput|null;
        newRecord:boolean;

        constructor(user: UserOutput, employee: EmployeeOutput | null, newRecord:boolean){
               this.user =user;
                this.employee= employee;
                this.newRecord = newRecord;
        }
}