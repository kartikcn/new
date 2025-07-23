export class CenterBudget {
  constructor(values: object = {}) {
    Object.assign(this, values);
  }
  centerBudgetId: number = 0;
  budgetTermId!: number;
  blId!: number;
  flId!: number;
  itemId!: number;
  budget!: number;
  enteredBy!: number;
  enteredDate!: string;
}
