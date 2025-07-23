import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SlaRequestParametersComponent } from '../model/sla-request-parameters.component';
import { AddEditSlaComponent } from '../widgets/add-edit-sla/add-edit-sla.component';

const routes: Routes = [
  { path: '', component: AddEditSlaComponent }
];

@NgModule({
    imports: [
            CommonModule,
            RouterModule.forChild(routes)
    ],
    exports: [
            RouterModule
    ],
    declarations: []
})
export class AddEditSlaRoutingModule { }
