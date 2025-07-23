export class BudgetTermReportInputs {
    constructor(values: object = {}) {
      Object.assign(this, values);
    }
    budgetTermId!:number;
	blId!:number;
	flId!:number;
	itemId!:number|null;
	budget!:number|null;
	expense!:number|null;
  }
  