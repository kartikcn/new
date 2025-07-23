export class Messages{
    public msgId?:number|null;
    public processId?:number|null;
    public msgText?:string='';
    public msgCode?:string='';
    constructor(values: object = {}) {
        Object.assign(this, values);
}
}