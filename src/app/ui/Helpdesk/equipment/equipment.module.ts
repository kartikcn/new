import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentComponent } from './modal/equipment.component';
import { EquipmentRoutingModule } from './routing/equipment.routing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddEditEqFormComponent } from './widgets/add-edit-equipment/add-edit-eq-form/add-edit-eq-form.component';
import { AddEqFormComponent } from './widgets/add-equipment/add-eq-form/add-eq-form.component';
import { DocumentsListModule } from '../../documents-list/documents-list.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { AssetInsuranceModule } from './widgets/asset-insurance/asset-insurance.module';
import { AssetLeaseModule } from './widgets/asset-lease/asset-lease.module';
import { AssetLocationModule } from './widgets/asset-location/asset-location.module';
import { AssetWarrantyModule } from './widgets/asset-warranty/asset-warranty.module';
import { SelectAssetClassificationModule } from './widgets/select-asset-classification/select-asset-classification.module';
import { AddEditEquipmentModule } from './widgets/add-edit-equipment/add-edit-equipment.module';



@NgModule({
    declarations: [
        EquipmentComponent,
    ],
    imports: [
        CommonModule,
        EquipmentRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        PrimeNGModule,
        DocumentsListModule,
        MatTooltipModule,
        PaginatorModule,
        AddEditEquipmentModule
    ],
    exports: [EquipmentComponent],
    providers: []
})
export class EquipmentModule { }
