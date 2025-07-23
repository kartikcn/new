export class Holidays{

    constructor(values: object = {}) {
        Object.assign(this, values);
    }

    public holidayDate?: Date | any=new Date();
    public holidayDesc?: string = '';
    public holidaysId?: number = 0;
    
}
