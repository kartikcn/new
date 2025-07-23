export class ReserveDTO {

    constructor(values: object = {}) {
        Object.assign(this, values);
    }
    public reserveId?: number;
    public loggedBy?: number;
    public requestedBy?: number;
    public requestedFor?: number;
    public status?: string | null;
    public meetingName?: String;
    public comments?: string;
    public bookingType?: string;
    public recurringRule?: string;
    public dateStart?: Date | string | null;
    public timeStart!: Date | string | null;
    public timeEnd!: Date | string | null;
    public blId?: number;
    public flId?: number;
    public rmId?: number;
    public configId?:number;
    public cancelledReason?:string | null;
    public cancelledBy ?:number |null;
    public dateCancelled ?:Date | string | null;
    public timeCancelled ?:Date | string | null;
    public rejectionReason?:string | null;
    public rejectedBy?:number | null;
    public dateRejected ?:Date | string | null;
    public dateEnd ?:Date | string | null;
    public approvedBy?:number | null;
    public dateApproved?:Date | string | null;
    public parentId?:number | 0;
    public dateCreated?:Date | string | null;
    public timeCreated?:Date | string | null;
    public isDateOrTimeChanged ?:boolean | null;
    public deletedAttendeesIdList?:number[] | null;
    public checkInNotifyCount?: number | 0;
    public deletedResourcesIdList?:number[] | null;
}