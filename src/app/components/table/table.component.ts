import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  @Input()
  columns: TableColumn[] = [];
  @Input()
  searchFilters: SearchFilter[] = [];
  @Input()
  hasNextPage: boolean = false;
  @Input()
  isLoading: boolean = false;
  @Input()
  data: TableRecord[] = [];
  @Output()
  onSearch: EventEmitter<SearchFilter[]> = new EventEmitter<SearchFilter[]>();
  @Output()
  onLoadMore: EventEmitter<void> = new EventEmitter<void>();
  @Output()
  onViewInfo: EventEmitter<string> = new EventEmitter<string>();

  public searchClick(){
    this.onSearch.emit(this.searchFilters);
  }

  public loadMoreClick(){
    this.isLoading = true;
    this.onLoadMore.emit();
  }

  public viewInfoClick(id: string){
    this.onViewInfo.emit(id);
  }

  getColumnById(id: number): TableColumn | undefined {
    return this.columns[id];
  }
}

export type TableColumn = {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  translate?: boolean;
}

export type TableRecord = {
  id: string;
  values: (string | number | Date | boolean)[];
}

export type SelectOption = {
  value: any;
  label: string;
  selected?: boolean;
}

export type SearchFilter = {
  column: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'select' | 'checkbox' | 'radio';
  value: string | number | Date | boolean;
  selectOptions?: SelectOption[];
  defaultValue?: string | number | boolean;
  placeholder?: string;
}