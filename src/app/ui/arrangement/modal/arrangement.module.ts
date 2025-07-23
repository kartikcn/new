import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { ToastrModule } from "ngx-toastr";
import { MaterialModule } from "src/app/material/material.module";
import { PrimeNGModule } from "src/app/material/primemg.module";import { SharedModule } from "primeng/api";
import { ArrangementComponent } from "./arrangement.component";
import { ArrangementRoutingModule } from "../routing/arrangement-routing";
import { AddEditArrangementComponent } from "../widgets/add-edit-arrangement/add-edit-arrangement.component";
import { AddArrangementComponent } from "../widgets/add-arrangement/add-arrangement.component";
import { PaginatorModule } from "primeng/paginator";
import { DirectiveModule } from "src/app/directive/directive/directive.module";



@NgModule({
    declarations: [ArrangementComponent, AddEditArrangementComponent, AddArrangementComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        MaterialModule,
        PrimeNGModule,
        ArrangementRoutingModule,
        ToastrModule,
        SharedModule,
        PaginatorModule,
        DirectiveModule
    ],
    exports: [ArrangementComponent]
})

export class ArrangementAllModule{}