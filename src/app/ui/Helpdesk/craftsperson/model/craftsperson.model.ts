export class Craftsperson {
    public cfId!: any;
    public name!: string;
    public email!: string;
    public phone!: string;
    public status!: number;
    public compId!: number | null;
    public isSupervisor!: number | null;
    public skills!: string | null;
    public rateHourly!: number;
    public rateDouble!: number;
    public rateOver!: number;
    public stdHoursAvail!: number;
    public inHouseOrContractor!: number;
    public primaryTrade!: string;
    public supplierId!:number

    constructor(cfId: any, name: string, email: string, phone: string, status: number, compId: number, isSupervisor: number, skills: string, rateHourly: number,
        rateDouble: number, rateOver: number, stdHoursAvail: number, inHouseOrContractor: number, primaryTrade: string) {
        this.cfId = cfId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.status = status;
        this.compId = compId;
        this.isSupervisor = isSupervisor;
        this.skills = skills;
        this.rateDouble = rateDouble;
        this.rateHourly = rateHourly;
        this.rateOver = rateOver;
        this.stdHoursAvail = stdHoursAvail;
        this.inHouseOrContractor = inHouseOrContractor;
        this.primaryTrade = primaryTrade;
    }
    
}
