export class Department {
    constructor(values: object = {}) {
        Object.assign(this, values);
    }
    public depId!: string;
    public description!: string;
    public depCode!: string;
    public highlightColor!: string;
    public depHead!: string;
    public divId!: string;

}
