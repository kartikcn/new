import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
        declarations: [],
        imports: [
                CommonModule,
                MatTabsModule,
                MatSidenavModule,
                MatToolbarModule,
                MatIconModule,
                MatButtonModule,
                MatListModule,
                MatMenuModule,
                MatTableModule,
                MatSortModule,
                MatFormFieldModule,
                MatInputModule,
                MatPaginatorModule,
                MatDialogModule,
                MatCardModule,
                MatCheckboxModule,
                MatButtonToggleModule,

        ],
        exports: [
                MatTabsModule,
                MatSidenavModule,
                MatToolbarModule,
                MatIconModule,
                MatButtonModule,
                MatListModule,
                MatMenuModule,
                MatTableModule,
                MatSortModule,
                MatFormFieldModule,
                MatInputModule,
                MatPaginatorModule,
                MatDialogModule,
                MatCardModule,
                MatCheckboxModule,
                MatButtonToggleModule,
        ]
})
export class MaterialModule { }
