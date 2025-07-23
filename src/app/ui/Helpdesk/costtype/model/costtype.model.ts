export class CostType {

    constructor(values: object = {}) {
        Object.assign(this, values);
    }
    public costType!: string;
    public description!: string | null;
    public compId!: number;
}
