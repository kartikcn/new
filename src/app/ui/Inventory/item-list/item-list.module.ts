import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemListComponent } from './item-list.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { ItemListRoutingModule } from './routing/item-list.routing';
import { AddEditItemModule } from './add-edit-item/add-edit-item.module';
import { MaterialModule } from 'src/app/material/material.module';



@NgModule({
  declarations: [ItemListComponent],
  imports: [
    CommonModule,
    PrimeNGModule,
    ReactiveFormsModule,
    FormsModule,
    PaginatorModule,
    ItemListRoutingModule,
    AddEditItemModule,
    MaterialModule,
  ],
  exports:[ItemListComponent],
  providers:[]
})
export class ItemListModule { }
