import { AppParams } from "./app-params.model";

export class AppParamsDTO{
    appParams!:AppParams;
    constructor(values: object = {}) {
        Object.assign(this, values);
}
}