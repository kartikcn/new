import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { ToastrModule } from "ngx-toastr";
import { MaterialModule } from "src/app/material/material.module";
import { PrimeNGModule } from "src/app/material/primemg.module";
import { MessagesComponent } from "./messages.component";
import { MessagesRoutingModule } from "../routing/messages-routing";
import { SharedModule } from "primeng/api";
import { MatTooltipModule } from "@angular/material/tooltip";
import { AddEditMessagesModule } from "../widgets/add-edit-messages/add-edit-messages.module";
import { PaginatorModule } from "primeng/paginator";


@NgModule({
    declarations: [MessagesComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        MaterialModule,
        PrimeNGModule,
        MessagesRoutingModule,
        ToastrModule,
        SharedModule,
        MatTooltipModule,
        AddEditMessagesModule,
        PaginatorModule
    ],
    exports: [MessagesComponent]
})

export class MessagesAllModule{}