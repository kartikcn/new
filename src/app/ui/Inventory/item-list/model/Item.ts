export class Item {
  constructor(values: object = {}) {
    Object.assign(this, values);
  }
  itemId: number = 0;
  name!: string;
  stock: number = 0;
  unit!: string;
  minStockReq: number = 0;
  rate: number = 0;
}
