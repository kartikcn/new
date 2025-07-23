export class StateList{

    constructor(values: object = {}) {
        Object.assign(this, values);
    }

    public stateId?: string = '';
    public stateName?: string = '';
    public countryId?:string='';
    public regnId?:string='';
    
}
