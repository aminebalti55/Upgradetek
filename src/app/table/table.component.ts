import { Component, OnInit } from '@angular/core';
import { DataService } from  "../data.service"
import { ColDef, GridOptions } from 'ag-grid-community';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { AgGridModule } from 'ag-grid-angular';
import { environment } from '../../environments/environment';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface TreeNode {
  bloclibelle: string;
  children?: TreeNode[];

}


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0', opacity: 0 })),
      state('expanded', style({ height: '*', opacity: 1 })),
      transition('collapsed <=> expanded', animate('300ms ease-in-out')),
    ]),
  ],
})
export class TableComponent implements OnInit {

  data: any[] = [];
  userRoles: string[] = [];
  treeData: TreeNode[] = [];
  treeControl = new NestedTreeControl<TreeNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<TreeNode>();
  selectedBloclibelles: string[] = [];


  gridOptions: any = {
    suppressHorizontalScroll: true,
    suppressScrollOnNewData: true,
    getRowHeight: this.customRowHeightGetter.bind(this),

  };

  customRowHeightGetter(params: any): number {
    const actionLibelleChunks = params.data.ActionLibelles;
    const lineHeight = 24;
    const minHeight = 250;

    const totalHeight = actionLibelleChunks.reduce((total: number, chunk: string[]) => {
      const numLines = Math.ceil(chunk.length / 10); 
      return total + (numLines * lineHeight);
    }, 0);

    return Math.max(totalHeight, minHeight);
  }



  actionCellRenderer(params: any): string {
    const actionLibelleChunks = params.value;
    const content = `
  <div class="action-libelles-container">
    <div class="input-tags-wrapper"> <!-- Add this wrapping container -->
      ${actionLibelleChunks.map((chunk: string[], chunkIndex: number) => `
        <div class="input-tags-row"> <!-- New: Row container -->
          ${chunk.map((action: string, actionIndex: number) => `
            <div class="input-tag-wrapper">
              <input type="text" class="input-tag${actionIndex === 0 ? ' first-input' : ''} action-tag" value="${action}" />
            </div>
          `).join(' ')}
        </div>
      `).join(' ')}
    </div>
  </div>
`;

return content;
  }


  rowData: any[] = [];

  columnDefs: ColDef[] = [
    { headerName: 'Operation Libelle', field: 'OperationLibelle', width: 165,
  },
    {


        headerName: 'Action',
        field: 'ActionLibelles',
        cellRenderer: this.actionCellRenderer,
        cellStyle: { 'white-space': 'normal', 'overflow': 'visible' },

        valueGetter: this.getActionLibelles,

        width: 800,
      },

    { headerName: 'Role', field: 'Role', width: 600 ,
  },
  ];




  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getData().subscribe(data => {
      this.data = data;
      this.findUniqueUserRoles();
      this.createTreeData();
      document.addEventListener('click', this.handleInputTagClick.bind(this));

    });

  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleInputTagClick.bind(this));
  }


  private handleInputTagClick(event: Event) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('action-tag')) {
      target.classList.toggle('clicked');
    }
  }

  showTreeGrid = false;
  buttonLabel: string = 'Toggle Tree Grid';

  toggleTreeGrid() {
    this.showTreeGrid = !this.showTreeGrid;
    this.buttonLabel = this.showTreeGrid ? 'Hide Tree Grid' : 'Toggle Tree Grid';

  }


  onCheckboxClick(bloclibelle: string) {
    const index = this.selectedBloclibelles.indexOf(bloclibelle);

    if (index === -1) {
      this.selectedBloclibelles.push(bloclibelle);
    } else {
      this.selectedBloclibelles.splice(index, 1);
    }

    const filteredData = this.data
      .filter(item => this.selectedBloclibelles.includes(item.bloclibelle))
      .map(item => ({
        operationLibelle: item.operation_libelle,
        actionLibelle: item.actionlibelle
      }));

    const operationLibelleMap = new Map<string, string[]>();
    filteredData.forEach(item => {
      if (!operationLibelleMap.has(item.operationLibelle)) {
        operationLibelleMap.set(item.operationLibelle, [item.actionLibelle]);
      } else {
        operationLibelleMap.get(item.operationLibelle)?.push(item.actionLibelle);
      }
    });

    const maxInputTagsPerLine = 10;

const rowData = Array.from(operationLibelleMap).map(([operationLibelle, actionLibelles]) => {
  const actionLibelleChunks = [];
  for (let i = 0; i < actionLibelles.length; i += maxInputTagsPerLine) {
    actionLibelleChunks.push(actionLibelles.slice(i, i + maxInputTagsPerLine));
  }

  return {
    Bloc: this.selectedBloclibelles.join(', '),
    Action: '',
    Role: '',
    OperationLibelle: operationLibelle,
    ActionLibelles: actionLibelleChunks,
  };
}).flat();





    this.rowData = rowData;
  }



  createTreeData() {
    const uniqueblocLibelle = Array.from(new Set(this.data.map(item => item.bloclibelle)));
    this.treeData = uniqueblocLibelle.map(bloclibelle => {
      return {
        bloclibelle: bloclibelle,
        children: this.data.filter(item => item.bloclibelle === bloclibelle).map(item => {
          return {
            bloclibelle: item.bloclibelle
          };
        })
      };
    });

    this.dataSource.data = this.treeData;
  }





  height = 'auto';


  getActionLibelles(params: any): string {
    return params.data.ActionLibelles;
  }

  findUniqueUserRoles() {
    const uniqueRolesSet = new Set<string>();
    this.data.forEach(item => uniqueRolesSet.add(item.userid));
    this.userRoles = Array.from(uniqueRolesSet);
  }

  hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;

}
