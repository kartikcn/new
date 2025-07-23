import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatCardModule } from '@angular/material/card';
import { MaterialModule } from 'src/app/material/material.module';
import { AddSiteItemComponent } from './add-site-item.component';
import { AntDesignModule } from '../../../../material/ant-design.module';
import { FileUploadModule } from 'primeng/fileupload';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';

@NgModule({
  declarations: [AddSiteItemComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MatCardModule,
    MaterialModule,
    AntDesignModule,
    FileUploadModule,
    DirectiveModule
  ],
  exports: [AddSiteItemComponent]
})
export class AddSiteItemModule { }
