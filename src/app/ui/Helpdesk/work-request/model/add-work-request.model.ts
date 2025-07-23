export class WorkRequest {

    constructor(values: object = {}) {
        Object.assign(this, values);
    }
    public wrId!: number;
    public parentWrId!: number;
    public status!: number;
    public blId!: string | null;
    public flId!: string | null;
    public rmId!: string | null;
    public eqId!: string | null;
    public probType!: number;
    public description!: string | null;
    public dateRequested!: Date | string | null;
    public timeRequested!: Date | string | null;
    public dateCompleted!: Date | string | null;
    public timeCompleted!: Date | string | null;
    public dateResponded!: Date | string | null;
    public timeResponded!: Date | string | null;
    public escTimeResponded!: Date | string | null;
    public escDateResponded!: Date | string | null;
    public escDateCompleted!: Date | string | null;
    public escTimeCompleted!: Date | string | null;
    public slaRequestParametersId!: number | null;
    public requestedBy!: string| null;
    public requestedFor!: string | null;
    public compId!: number
    public dateToPerform!: Date | string | null;
    public selectedSlaRespParamId! : number;
}