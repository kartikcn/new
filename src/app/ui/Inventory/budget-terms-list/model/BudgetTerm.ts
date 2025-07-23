export class BudgetTerm {
  constructor(values: object = {}) {
    Object.assign(this, values);
  }
  budgetTermId: number = 0;
  name!: string;
  dateFrom!: string;
  dateTo!: string;
}
