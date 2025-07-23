export class EmployeeDetails{
        fullName?:string | null;
        emId!: number;
        initials!: string;
        firstName!: string;
        lastName!: string;
        maidenName!: string;
        aliasName!: string;
        email!: string;
        emstdId!: number;
        emStatus!: number;
        idNumber!: string;
        birthDate!: Date;
        gender!: number;
        compName!: string;
        dateJoin!: string;
        dateLeave!: string;
        emPhoto?:any;
        costCentreId?:Number|null;
        lineMngr?:string|null;
        emPhotoMobile?:any;
        emCode!:string;

        constructor(values: object = {}) {
                Object.assign(this, values);
        }
}