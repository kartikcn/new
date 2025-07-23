import { EmployeeContact } from "../../employee/model/employee-contact.model";
import { EmployeeDetails } from "../../employee/model/employee-details.model";
import { EmployeeLocation } from "../../employee/model/employee-location.model";

export class EmployeeOutput{
        
       employeeDetails!:EmployeeDetails;
       employeeLocation!:EmployeeLocation
       employeeContact!:EmployeeContact

        constructor(values: object = {}) {
                Object.assign(this, values);
        }
}
