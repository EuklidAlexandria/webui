import { TooltipPosition } from '@angular/material/tooltip';
import { Observable } from 'rxjs';
import { ApiMethod } from 'app/interfaces/api-directory.interface';
import { EntityTableComponent } from 'app/pages/common/entity/entity-table/entity-table.component';

export interface EntityTableConfig {
  columns: EntityTableColumn[];

  prerequisite?: () => Promise<boolean>;
  globalConfig?: any;
  columnFilter?: boolean;
  hideTopActions?: boolean;
  queryCall?: ApiMethod;
  queryCallOption?: any;
  queryCallJob?: boolean;
  resource_name?: string;
  route_edit?: string | string[];
  route_add?: string[];
  queryRes?: any [];
  showActions?: boolean;
  isActionVisible?: (actionId: string, row: any) => boolean;
  custActions?: any[];
  multiActions?: EntityTableMultiAction[];
  multiActionsIconsOnly?: boolean;
  noActions?: boolean;
  config?: EntityTableConfigConfig;
  confirmDeleteDialog?: any;
  hasDetails?: boolean;
  rowDetailComponent?: any;
  detailRowHeight?: any;
  cardHeaderComponent?: any;
  asyncView?: boolean;
  wsDelete?: ApiMethod;
  wsMultiDelete?: ApiMethod;
  noAdd?: boolean;
  emptyTableConfigMessages?: {
    errors?: { title: string; message: string };
    first_use?: { title: string; message: string };
    loading?: { title: string; message: string };
    no_page_data?: { title: string; message: string };
    no_search_results?: { title: string; message: string };
    buttonText?: string;
  };
  actionsConfig?: { actionType: any; actionConfig: any };
  rowIdentifier?: string;
  disableActionsConfig?: boolean;

  wsDeleteParams?: (row: any, id: string) => any;
  addRows?: (entity: EntityTableComponent) => void;
  changeEvent?: (entity: EntityTableComponent) => void;
  preInit?: (entity: EntityTableComponent) => void;
  afterInit?: (entity: EntityTableComponent) => void;
  dataHandler?: (entity: EntityTableComponent) => any;
  resourceTransformIncomingRestData?: (data: any) => any;
  getActions?: (row: any) => EntityTableAction[];
  getAddActions?: () => any[];
  rowValue?: (row: any, attr: string) => any;
  wsMultiDeleteParams?: (selected: any) => any;
  updateMultiAction?: (selected: any) => any;
  doAdd?: (id?: string | number, tableComponent?: EntityTableComponent) => void;
  doEdit?: (id?: string | number, tableComponent?: EntityTableComponent) => void;
  onCheckboxChange?: (row: any) => any;
  onSliderChange?: (row: any) => any;
  onButtonClick?: (row: any) => any;
  callGetFunction?: (entity: EntityTableComponent) => any;
  prerequisiteFailedHandler?: (entity: EntityTableComponent) => void;
  afterDelete?(): void;

  addComponent?: any;
  editComponent?: any;

  onRowClick?: (row: any) => any;
}

export interface EntityTableAction {
  id: string | number;
  // TODO: Either name or actionName may be unnecessary
  name: string;
  actionName: string;
  icon: string;
  label: string;
  onClick: (row?: any) => void;
  disabled?: boolean;
}

export interface EntityTableMultiAction {
  id: string;
  onClick: (selection: any) => void;
  icon: string;
  label: string;
  enable: boolean;
  ttpos: TooltipPosition;
}

// The name is not smart, but it reflects the reality.
export interface EntityTableConfigConfig {
  name?: string; // TODO: Unclear if this field actually exists
  paging?: boolean;
  multiSelect?: boolean;
  deleteMsg?: {
    doubleConfirm?: (item: any) => Observable<boolean>;
    id_prop?: string;
    title?: string;
    key_props: string[];
  };
  pagingOptions?: {
    pageSize?: number;
    pageSizeOptions?: number[];
  };
  sorting?: {
    columns: {
      name: string;
      sort?: 'asc' | 'desc';
    }[];
  };
}

export interface EntityTableColumn {
  prop: EntityTableColumnProp;
  name: string;

  maxWidth?: number;
  always_display?: boolean;
  hidden?: boolean;
  checkbox?: boolean;
  toggle?: boolean;
  button?: boolean;
  enableMatTooltip?: boolean;

  icon?: string;
  widget?: {
    component: string;
    icon: string;
  };

  /**
   * TODO: These below probably do not do anything.
   */
  minWidth?: number;
  selectable?: boolean;
}

export type EntityTableColumnProp = string
| 'expandedDetail'
| 'expansion-chevrons'
| 'action'
| 'multiselect'
| 'state'
| 'enabled' | 'enable' | 'autostart';
