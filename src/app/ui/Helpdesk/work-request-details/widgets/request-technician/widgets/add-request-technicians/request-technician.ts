

export class RequestTechnician {

    constructor(values: object = {}) {
        Object.assign(this, values);
    }
    public technicianId!:number;
    public dateAssign!:string;
    public timeAssign!:string;
	public hoursRequired!:string;
    public requestTechnicianId!:number;
    public requestId!:number;

}