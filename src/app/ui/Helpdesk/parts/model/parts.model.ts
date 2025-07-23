export class Parts {

    constructor(values: object = {}) {
        Object.assign(this, values);
    }
    public partCode!: string;
    public description!: string | null;
    public compId!: number;
    public modelNo!:string ;
    public qutMinHand!: number;
    public qutOnHand!:number;
    public consumable!: number;
    public qutOnOrder!:number;
    public unitOfMeasurement!:number;
    public ratePerUnit!:number;
}
