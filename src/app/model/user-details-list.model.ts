export class UserDetailsList{

    constructor(values: object = {}) {
        Object.assign(this, values);
    }

    public userName?:string='';
    public deviceId?:string='';
    public employeeLast_name?: string;
    public employeeMaiden_name?: string='';
    public employeeAlias_name?: string='';
    public employeeEmail?: string='';
    public employeeEm_std?: string;
    public em_status?: number;
}