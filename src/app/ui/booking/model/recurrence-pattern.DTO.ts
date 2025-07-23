export class RecurrencePattarnDTO {

    constructor(values: object = {}) {
        Object.assign(this, values);
    }
    public type?: string;
    public frequency?: string;
    public monthDays?: string;
    public weekDays?:string;
    public weeks?:string;
}