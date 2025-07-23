import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsListComponent } from './modal/documents-list.component';
import { AddDocumentModule } from './widgets/add-document/add-document.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [
    DocumentsListComponent
  ],
  imports: [
    CommonModule,
    AddDocumentModule,
    PrimeNGModule,
    MatDialogModule,
    MaterialModule,
    NgSelectModule,
    MatTooltipModule
  ],
  exports:[DocumentsListComponent]
})
export class DocumentsListModule { }
