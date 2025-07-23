export class Trade {

    constructor(values: object = {}) {
        Object.assign(this, values);
    }
    public tradeId!: string;
    public rateHourly!: DoubleRange;
    public rateDouble!: DoubleRange;
    public rateOver!: DoubleRange;
    public stdHoursAvail!: DoubleRange;
    public description!: string;
    public compId!: number | null;
}
