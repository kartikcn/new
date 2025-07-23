export class EnumList{

    public enumListId?: number|null;
    public tableName: string;
    public fieldName: string;
    public enumValue:string;
    public enumKey:string|null;

    constructor(enumListId: number | null, tableName: string, fieldName: string, enumValue:string,enumKey:string|null) {
        this.enumListId = enumListId;
        this.tableName = tableName;
        this.fieldName = fieldName;
        this.enumValue = enumValue;
        this.enumKey = enumKey;
    }
}


