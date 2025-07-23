export class CenterUsage {
  constructor(values: object = {}) {
    Object.assign(this, values);
  }
  centerUsageId: number = 0;
  budgetTermId!: number;
  blId!: number;
  flId!: number;
  itemId!: number;
  quantity: number = 0;
  rate: number = 0;
  cost: number = 0;
  overUsageReason!: string | null;
  enteredBy!: number;
  enteredDate!: string;
}
