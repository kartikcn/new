export class EmployeeLocation {

        blId!: number|null;
        flId!: number|null;
        rmId!: number|null;
        workType:string|null=null;
        divId :number| null= null;
        depId :number| null= null;
        subDepId: number| null= null;
        constructor(values: object = {}) {
                Object.assign(this, values);
        }
}