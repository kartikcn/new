import { Injectable } from "@angular/core";
import { DataService } from "src/app/services/data.service";


@Injectable({
    providedIn: 'root'
  })

export class RmTransService {

constructor(
    private rmtransservice: DataService<any>,
) { }

    public saveRmTrans(data:any){
    return this.rmtransservice.add('rmtrans','save',data);
}

public getAllRmTrans(){
    return this.rmtransservice.getAll('rmtrans','all');
}
}