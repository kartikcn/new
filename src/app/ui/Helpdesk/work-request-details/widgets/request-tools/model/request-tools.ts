import { Numeric } from "d3";

export class RequestTools {

    constructor(values: object = {}) {
        Object.assign(this, values);
    }
    public reqToolId!: number;
    public dateAssign!: string | null;
    public timeAssign!: string | null;
    public hoursRequired!: number;
    public requestId!: number;
    public toolId!: string;
    public actualHoursStd!: number;
    public actualHoursDouble!:number;
    public actualHoursOvertime!:number;
}