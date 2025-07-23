import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PdfViewComponent } from './pdf-view.component';

const routes: Routes = [
  { path: '', component: PdfViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PDFRoutingModule { }
