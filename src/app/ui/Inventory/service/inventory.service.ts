import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  EVENT: string = '';
  API_NAME: string = '';
  constructor(private inventorySrv: DataService<any>) {}

  public getAllItems(): Observable<any> {
    return this.inventorySrv.getAll('item', 'getAll');
  }
  public getAllBudegetTerm(): Observable<any> {
    return this.inventorySrv.getAll('budgetTerms', 'getAll');
  }
  public getAllCenterBudget(): Observable<any> {
    return this.inventorySrv.getAll('centerBudget', 'getAll');
  }
  public getAllCenterUsage(): Observable<any> {
    return this.inventorySrv.getAll('centerUsage', 'getAll');
  }
  public getItemByItemId(id: any): Observable<any> {
    return this.inventorySrv.getAllById('item', 'getItemById', id);
  }
  public getBudegetTermById(id: any): Observable<any> {
    return this.inventorySrv.getAllById('budgetTerms','getBudgetTermsById', id);
  }
  public getCenterBudgetById(id: any): Observable<any> {
    return this.inventorySrv.getAllById('centerBudget', 'getCenterBudgetById', id);
  }
  public getCenterUsageById(id: any): Observable<any> {
    return this.inventorySrv.getAllById('centerUsage', 'getCenterUsageById', id);
  }
  public saveItem(data: any) {
    return this.inventorySrv.add('item', 'saveItem', data);
  }
  public saveBudgetTerm(data: any) {
    return this.inventorySrv.add('budgetTerms', 'saveBudgetTerms', data);
  }
  public saveCenterBudget(data: any) {
    return this.inventorySrv.add('centerBudget', 'saveCenterBudget', data);
  }
  public saveCenterUsage(data: any) {
    return this.inventorySrv.add('centerUsage', 'saveCenterUsage', data);
  }
  public checkUsage(data: any) {
    return this.inventorySrv.add('centerUsage', 'checkIfTotalCostExceed', data);
  }
  public deleteItem(data: any) {
    return this.inventorySrv.getSingleById('item', 'deleteByItemId', data);
  }
  public deleteBudgetTerm(data: any) {
    return this.inventorySrv.getSingleById('budgetTerms', 'deleteByBudgetTermId', data);
  }
  public deleteCenterBudget(data: any) {
    return this.inventorySrv.getSingleById('centerBudget', 'deleteCenterBudgetById', data);
  }
  public deleteCenterUsage(data: any) {
    return this.inventorySrv.getSingleById('centerUsage', 'deleteCenterUsageById', data);
  }
  public getCenterBudgetByBudgetTermId(id: any): Observable<any> {
    return this.inventorySrv.getSingleById('inventoryReport', 'getByBudgetTermId', id);
  }
  public getCenterBudgetByBlIdFlId(data: any): Observable<any> {
    return this.inventorySrv.search('inventoryReport', 'getByBudgetTermInputs', data);
  }
  public getCenterUsageExpense(data: any): Observable<any> {
    return this.inventorySrv.search('inventoryReport', 'getExpenseByBudgetTermBlFl', data);
  }
  public getCenterUsageItemExpense(data: any): Observable<any> {
    return this.inventorySrv.search('inventoryReport', 'getExpenseByBudgetTermBlFlItem', data);
  }
}
