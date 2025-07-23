export class CityList{

    constructor(values: object = {}) {
        Object.assign(this, values);
    }

    public cityId?: string = '';
    public cityName?: string = '';
    public countryId?:string='';
    public regnId?: string = '';
    public stateId?: string = '';
    
}
