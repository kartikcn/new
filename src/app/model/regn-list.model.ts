export class RegnList{

    constructor(values: object = {}) {
        Object.assign(this, values);
    }

    public regnId?: string = '';
    public regnName?: string = '';
    public ctryId?:string='';
    
}
