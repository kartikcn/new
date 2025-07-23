import { NgModule } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PdfViewComponent } from './pdf-view.component';
import { PDFRoutingModule } from './pdf-view-routing.module';

@NgModule({
  imports: [PDFRoutingModule,PdfViewerModule],
  declarations: [ PdfViewComponent],
  exports: [PdfViewComponent]
})
export class PDFViewModule { }
