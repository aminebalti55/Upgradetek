import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-TagsCellRenderer',
  templateUrl: './TagsCellRenderer.component.html',
  styleUrls: ['./TagsCellRenderer.component.css']
})
export class TagsCellRendererComponent implements ICellRendererAngularComp {
  actions: string[] = [];

  agInit(params: any): void {
    this.actions = params.value;
  }

  refresh(params: any): boolean {
    this.actions = params.value;
    return true;
  }
}


