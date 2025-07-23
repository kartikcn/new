export class ReserveAttendeesDTO {

    constructor(values: object = {}) {
        Object.assign(this, values);
    }
    public reserveAttendeesId?: number;
    public reserveId?: number;
    public email?: string;
    public attendeeName?: string;
    public isVisitor?: string
    public emId?: number | null;
    public visitorId?: number | null;
}