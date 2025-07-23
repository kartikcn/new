import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddEditSiteComponent } from './add-edit-site.component';
import { SiteModalDialogueProvider } from '../../provider/site.provider';
import { AddSiteItemModule } from '../add-site-item/add-site-item.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';


@NgModule({
  declarations: [AddEditSiteComponent ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MatCardModule,
    MatDialogModule,
    MaterialModule,
    ConfirmBoxDialogModule,
    AddSiteItemModule,
    PrimeNGModule,
    DirectiveModule

    
  ],
  exports: [AddEditSiteComponent ],
  providers: [SiteModalDialogueProvider
  ]
})
export class AddEditSiteDetail { }
