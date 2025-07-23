import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditEqFormComponent } from './add-edit-eq-form/add-edit-eq-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmationService } from 'primeng/api';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddResourcesFormModule } from 'src/app/ui/resources/widgets/add-resources-form/add-resources-form.module';
import { DocumentsListModule } from 'src/app/ui/documents-list/documents-list.module';
import { AssetWarrantyModule } from '../asset-warranty/asset-warranty.module';
import { AssetLocationModule } from '../asset-location/asset-location.module';
import { AssetLeaseModule } from '../asset-lease/asset-lease.module';
import { AssetInsuranceModule } from '../asset-insurance/asset-insurance.module';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { AddEquipmentModule } from '../add-equipment/add-equipment.module';



@NgModule({
  declarations: [
    AddEditEqFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AddResourcesFormModule,
    FormsModule,
    NgSelectModule,
    MatCardModule,
    MatDialogModule,
    MaterialModule,
    PrimeNGModule,
    DocumentsListModule,
    AssetWarrantyModule,
    AssetLocationModule,
    AssetLeaseModule,
    AssetInsuranceModule,
    SelectButtonModule,
    DirectiveModule,
    AddEquipmentModule,
    PrimeNGModule
  ],
  exports: [AddEditEqFormComponent],
  providers: [ ConfirmationService
  ]
})
export class AddEditEquipmentModule { }
