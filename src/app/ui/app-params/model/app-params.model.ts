export class AppParams{
    appParamsId?:number;
    paramId?:string;
    paramValue:string="";
    description:string="";
    isEditable : string="";

   constructor(values: object = {}) {
           Object.assign(this, values);
   }
}