import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from 'src/app/services/data.service';



@Injectable({
  providedIn: 'root'
})
export class ConnectorService {

  constructor(
    private connectorService: DataService<any>,

  ) { }


  public getAllTabes() {
    return this.connectorService.getAll('connector', 'getAllTables');
  }

  public getAllColumns() {
    return this.connectorService.getAll('connector', 'getAllColumns');
  }

  public getAllConnectors() {
    return this.connectorService.getAll('connector', 'getAll');
  }

  public getConnectorById(id: any) {
    return this.connectorService.getSingleById("connector", "getById", id);
  }

  public saveConnector(data:any) {
    return this.connectorService.add("connector","save",data);
  }

  public getAllByConnectorId(connectorId:any) {
    return this.connectorService.getAllById("connectorFlds","getByConnectorId",connectorId);
  }

  public getConnectorFldsById(id:any) {
    return this.connectorService.getSingleById("connectorFlds","getById",id);
  }

  public saveConnectorFlds(data:any) {
    return this.connectorService.add("connectorFlds","save",data);
  }

  public getAllLogsByConnectorId(connectorId:any) {
    return this.connectorService.getAllById("connectorLog","getByConnectorId",connectorId);
  }

  public execute(data:any) {
    return this.connectorService.add("connector","execute",data);
  }


}
