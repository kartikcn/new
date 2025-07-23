export class CompList{

    constructor(values: object = {}) {
        Object.assign(this, values);
    }

    public comp_id?: number = 0;
    public comp_name?: string = '';
    public comp_reg_num?:string='';
    public num_employees?: number = 0;
    public comp_status?: number = 0;
    public phone?: number = 0;
    public alt_phone?: string = '';
    public fax_num?: string = '';
    
}
