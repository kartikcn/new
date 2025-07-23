export class VaildationError {
  public FieldId: string;
  public Type: string;
  public ErrorMessage: string;
  constructor(fieldId: any, type: any, errorMessage: any) {
    this.FieldId = fieldId;
    this.Type = type;
    this.ErrorMessage = errorMessage;
  }
}
