export interface TablePropType {
  id: string;
  tName: string;
  cName: string;
  col: string[];
  rows: RowType[];
}

export interface RowType {
  id: string;
  title: string;
  rData: RowData[];
  parentId: string;
  childRow: string[];
}

export interface RowData {
  type: string;
  value: number;
}

export interface MyTableProps {
  table: TablePropType;
  tables: TablePropType[];
  setTables: any;
}
export interface MyRowCellProps extends MyTableProps {
  isEdit: boolean;
  data: RowData;
  row: RowType;
  index: number;
 
}
