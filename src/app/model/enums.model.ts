export class Enums{

    public id?: number|null;
    public tableName: string;
    public fieldName: string;
    public enumValue:string;

    constructor(id: number | null, tableName: string, fieldName: string, enumValue:string) {
        this.id = id;
        this.tableName = tableName;
        this.fieldName = fieldName;
        this.enumValue = enumValue;
        
    }
}


