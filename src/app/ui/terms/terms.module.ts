import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { ToastrModule } from "ngx-toastr";
import { MaterialModule } from "src/app/material/material.module";
import { PrimeNGModule } from "src/app/material/primemg.module";
import { SharedModule } from "primeng/api";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TermsRoutingModule } from "./routing/terms.routing";
import { TermsComponent } from "./terms.component";
import { AddEditTermsModule } from "./widgets/add-edit-terms/add-edit-terms.module";
import { PaginatorModule } from "primeng/paginator";


@NgModule({
    declarations: [TermsComponent],
    imports: [
        CommonModule,
        PrimeNGModule,
        TermsRoutingModule,
        ToastrModule,
        SharedModule,
        MatTooltipModule,
        AddEditTermsModule,
        PaginatorModule
    ],
    exports: [TermsComponent],
    providers: []
})

export class TermsModule{}