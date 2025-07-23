export class RequestTechnicianLog {

    constructor(values: object = {}) {
        Object.assign(this, values);
    }
   public requestTechnicianLogId!: number;
    public actualHoursStd!:number;
    public actualHoursDouble!:number ;
    public actualHoursOvertime!:number ;
    public  workType!:number;
    public dateStarted!:string |null |Date ;
    public dateFinished!:string |null | Date;
    public timeStarted!:string |null;
    public timeFinished!:string |null;
    public requestId!:number;
    public technicianId!:number;
    public resourceType!:number;
    public emId! : any;
    public other! : string 
  }