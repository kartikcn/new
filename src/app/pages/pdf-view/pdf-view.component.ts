import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pdf-view',
  templateUrl: './pdf-view.component.html',
  styleUrls: ['./pdf-view.component.scss']
})
export class PdfViewComponent implements OnInit {

  src!: any;
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.src = this._base64ToArrayBufferPDF(localStorage.pdfSrc);
  }

  _base64ToArrayBufferPDF(base64: any) {
    var binary_string = base64.replace(/\\n/g, '');
    binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

}
