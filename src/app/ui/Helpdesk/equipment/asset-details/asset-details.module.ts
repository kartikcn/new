import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetDetailsComponent } from './asset-details.component';
import { AssetDetailsRoutingModule } from '../routing/add-edit-eq-routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { DocumentsListModule } from 'src/app/ui/documents-list/documents-list.module';
import { AssetInsuranceModule } from '../widgets/asset-insurance/asset-insurance.module';
import { AssetLeaseModule } from '../widgets/asset-lease/asset-lease.module';
import { AssetLocationModule } from '../widgets/asset-location/asset-location.module';
import { AssetWarrantyModule } from '../widgets/asset-warranty/asset-warranty.module';
import { AddEquipmentModule } from '../widgets/add-equipment/add-equipment.module';
import { AccordionModule } from 'primeng/accordion';



@NgModule({
  declarations: [
    AssetDetailsComponent
  ],
  imports: [
    CommonModule,
    AssetDetailsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
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
    AccordionModule
  ],
  exports:[AssetDetailsComponent]
})
export class AssetDetailsModule { }
