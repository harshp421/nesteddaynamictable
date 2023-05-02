import React from 'react'
import {
  Button,
  TableContainer,
  Table,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  TableBody,
} from '@mui/material';

import { useEffect, useState } from 'react';
import { Cancel, Delete } from '@mui/icons-material';
import { v4 as uuid } from 'uuid';
import { RowData, TablePropType } from '../utils/model.data';
import { AnyMxRecord } from 'dns';
import Row from './Row';

const Nestedtable = ({ table, tables, setTables }: any) => {
 
  // for edit button
  const [isEdit, setIsEdit] = useState(false);
  // for editing new type
  const [addType, setAddType] = useState(false);
  const [typeV, setTypeV] = useState('');
  const [categoryV, setCategoryV] = useState('');
  const [currentTable, setCurrentTable] = useState<TablePropType>();
  const [addCategory, setAddCategory] = useState(false);
  const [countValue, setCountValue] = useState<RowData[]>([]);
  const unique_id = uuid();
  const row_id = unique_id.slice(0, 8);

  

  /** just setting new row*/
  useEffect(() => {
    const newCount = table.col.map((col:any) => {
      const newObj = {
        type: col,
        value: 0,
      };
      return newObj;
    });
    setCountValue(newCount);
  }, [table.col]);


 /** for edding new row in table */
  useEffect(() => {
    const newRows = table.rows.map((r:any )=> {
      return { ...r, rData: countValue };
    });
    const newTable = { ...table, rows: newRows };
    const newTables = tables.map((t:any )=> {
      if (t.id === table.id) {
        return newTable;
      } else return { ...t };
    });

    setTables(newTables);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countValue, table.col]);

  const handleIsEdit = () => {
    const currentT = { ...table, rows: [...table.rows] };
    setCurrentTable(currentT);
    setIsEdit(!isEdit);
  };
  const handleAddType = () => {
    setAddType(!addType);
  };
  const handleAddCategory = () => {
    setAddCategory(!addCategory);
  };
  const handleSave = () => {
    setIsEdit(!isEdit);
  };

  const handleCancel = () => {
    if (table !== undefined) {
      const newTables = tables.map((obj: any) => {
        if (obj.id === table.id) {
          return currentTable;
        } else {
          return obj;
        }
      });
      setTables(newTables);
      setIsEdit(!isEdit);
    }
  };
  const handleCancelTypeAdd = () => {
    setTypeV('');
    setAddType(!addType);
  };
  const handleCancelCategoryAdd = () => {
    setCategoryV('');
    setAddCategory(!addCategory);
  };


  /** saving data  */
  const handleSaveType = () => {
    const newType = [...table.col, typeV];
    const newTables = tables.map((t:any) => {
      if (t.id === table.id) {
        return { ...table, col: newType };
      } else {
        return { ...t };
      }
    });
    setTables([...newTables]);
    handleCancelTypeAdd();
  };


  /** for saving riow */
  const handleSaveCategory = () => {
    const newRow = {
      id: row_id,
      title: categoryV,
      rData: countValue,
      parentId: '',
      childRow: [],
    };
    const newRows = [...table.rows, newRow];
    const newTables = tables.map((t:any) => {
      if (t.id === table.id) {
        return { ...table, rows: newRows };
      } else {
        return { ...t };
      }
    });
    setTables(newTables);

    handleCancelCategoryAdd();
  };

   /** for deleting column */
  const handleDeleteType = (col: string) => {
    const newType = table.col.filter((c :any )=> c !== col);
    const newTable = tables.map((t :any) => {
      if (t.id === table.id) {
        return { ...table, col: newType };
      } else {
        return { ...t };
      }
    });
    setTables(newTable);
  };

  return (
    <>
      <div className="table-wrapper">
      <div className="table-top">
        <h3 className="table-title">{table.tName}</h3>
        <div className="top-btn-wrapper">
          {!isEdit && (
            <Button onClick={handleIsEdit} variant="outlined" color="primary">
              Edit
            </Button>
          )}
          {isEdit && (
            <>
              <Button
                onClick={handleAddCategory}
                variant="outlined"
                color="primary"
              >
                Add Category
              </Button>
              <Button
                onClick={handleAddType}
                variant="outlined"
                color="secondary"
              >
                Add Types
              </Button>
              <Button onClick={handleCancel} variant="outlined" color="warning">
                Cancel
              </Button>
              <Button onClick={handleSave} variant="outlined" color="success">
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      <TableContainer component={Paper} sx={{ maxWidth: 1220 }}>
        <Table>
          <TableHead>
            <TableRow >
              <TableCell className="styledThead">
                <p>{table.cName}</p>
              </TableCell>
              {table.col.map((col:any, index:number) => (
                <TableCell key={index} className="styledThead">
                  <p>
                    {col}
                    {isEdit && (
                      <Delete
                        color="error"
                        onClick={() => handleDeleteType(col)}
                      />
                    )}
                  </p>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <>
              {table.rows.map((r:any) => {
                if (r.parentId === '') {
                  return (
                    <Row
                      key={r.id}
                      row={r}
                      table={table}
                      tables={tables}
                      setTables={setTables}
                      isEdit={isEdit}
                      countValue={countValue}
                      setCountValue={setCountValue}
                    />
                  );
                }
                return null;
              })}
            </>
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog onClose={handleCancelTypeAdd} open={addType} keepMounted>
        <DialogTitle className="dialog-title">
          <h4>Type Name</h4>
          <Cancel
            color="error"
            onClick={handleCancelTypeAdd}
            className="cancel-logo"
          />
        </DialogTitle>
        <DialogContent className="dialog-cont">
          <TextField
            id="addType"
            label="Type"
            variant="outlined"
            size="small"
            margin="dense"
            required
            value={typeV}
            onChange={e => setTypeV(e.target.value)}
          />
          <Button color="success" variant="outlined" onClick={handleSaveType}>
            Save
          </Button>
          <Button
            color="warning"
            variant="outlined"
            onClick={handleCancelTypeAdd}
          >
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog onClose={handleCancelCategoryAdd} open={addCategory} keepMounted>
        <DialogTitle className="dialog-title">
          <h4>Category Name</h4>
          <Cancel
            color="error"
            onClick={handleCancelCategoryAdd}
            className="cancel-logo"
          />
        </DialogTitle>
        <DialogContent className="dialog-cont">
          <TextField
            id="addCategory"
            label="Category"
            variant="outlined"
            size="small"
            required
            margin="dense"
            value={categoryV}
            onChange={e => setCategoryV(e.target.value)}
          />
          <Button
            color="success"
            variant="outlined"
            onClick={handleSaveCategory}
          >
            Save
          </Button>
          <Button
            color="warning"
            variant="outlined"
            onClick={handleCancelCategoryAdd}
          >
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
    </div>

    </>
  )
}

export default Nestedtable