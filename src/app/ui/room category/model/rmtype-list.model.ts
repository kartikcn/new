export class RmTypeList{

    constructor(values: object = {}) {
        Object.assign(this, values);
    }

    public rmType?: string = '';
    public rmCat?: string = '';
    public rmTypeDesc?:string='';
    public highlightColor?:string='';

}
