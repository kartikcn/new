export class RequestTechnician {

    constructor(values: object = {}) {
        Object.assign(this, values);
    }
    public technicianId!: number;
    public dateAssign!: string | null;
    public timeAssign!: string | null;
    public hoursRequired!: number;
    public requestTechnicianId!: number;
    public requestId!: number;
    public actualHoursStd!: number;
    public actualHoursDouble!:number;
    public actualHoursOvertime!:number;

}