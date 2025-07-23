import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDialogModule } from '@angular/material/dialog';
import { AddEditUserComponent } from './add-edit-user.component';
import { MaterialModule } from 'src/app/material/material.module';
import { AddUserItemModule } from '../add-user-item/add-user-item.module';
import  {AddEmployeeModule} from '../add-employee/add-employee.module';
import { UserModalDialogueProvider } from '../../provider/user.provider';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { ConfirmationService } from 'primeng/api';
import { EmployeeLocationModule } from 'src/app/ui/employee/widgets/employee-location/employee-location.module';
import { EmployeeContactModule } from 'src/app/ui/employee/widgets/employee-contact/employee-contact.module';


@NgModule({
    declarations: [AddEditUserComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        MatDialogModule,
        MaterialModule,
        ConfirmBoxDialogModule,
        AddUserItemModule,
        PrimeNGModule,
        AddEmployeeModule,
        EmployeeLocationModule,
        EmployeeContactModule
    ],
    exports: [AddEditUserComponent],
    providers: [UserModalDialogueProvider, ConfirmationService
    ]
})
export class AddEditUserDetail { }
