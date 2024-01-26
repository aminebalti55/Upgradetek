import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableComponent } from './table/table.component';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { AgGridModule } from 'ag-grid-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TreeGridModule } from '@syncfusion/ej2-angular-treegrid';
import { registerLicense } from '@syncfusion/ej2-base';
import { jqxTreeGridModule } from 'jqwidgets-ng/jqxtreegrid';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TagsCellRendererComponent } from './TagsCellRenderer/TagsCellRenderer.component';

@NgModule({
  declarations: [	
    AppComponent,
      TableComponent,
      TagsCellRendererComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,HttpClientModule,AgGridModule, BrowserAnimationsModule ,  MatTreeModule,TreeGridModule ,
    MatIconModule,jqxTreeGridModule,MatCheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { constructor() {
  registerLicense('Ngo9BigBOggjHTQxAR8/V1NGaF1cWGhAYVJ1WmFZfV1gfF9GY1ZTTWY/P1ZhSXxQdk1iXX1ecHdWRmZYUkU=');
}}
