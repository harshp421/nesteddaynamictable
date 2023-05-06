import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { AddCircle, Cancel, Delete, ExpandMore } from "@mui/icons-material";
import { v4 as uuid } from "uuid";
import { RowType } from "../utils/model.data";
import Cell from "./Cell";

const Row = ({
  row,
  isEdit,
  table,
  tables,
  setTables,
  countValue,
  setCountValue,
}: any) => {
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [dCategoryV, setDCategoryV] = useState("");
  const [childRow, setChildRow] = useState<RowType[]>();
  const unique_id = uuid();
  const row_id = unique_id.slice(0, 8);

  useEffect(() => {
    const newChildRows = table.rows.filter((r: any) =>
      row.childRow.includes(r.id)
    );
    setChildRow(newChildRows);
  }, [row.childRow, table.rows]);

  const handleCloseCategoryDialog = () => {
    setDCategoryV("");
    setOpenAddCategory(!openAddCategory);
  };

  const handleAddRow = () => {
    if (dCategoryV === "") {
      alert("Please select a category");
      return;
    }

    const newRow = {
      id: row_id,
      title: dCategoryV,
      rData: table.col.map((col: any) => {
        const newObj = {
          type: col,
          value: 0,
        };
        return newObj;
      }),
      parentId: row.id,
      childRow: [],
    };
    const newChildRow = [...row.childRow, newRow.id];
    const newParentRow = { ...row, childRow: newChildRow };
    const updatedRows = table.rows.map((tRow: any) => {
      if (tRow.id === row.id) {
        return { ...newParentRow };
      } else {
        return { ...tRow };
      }
    });
    const newRows = [...updatedRows, newRow];
    const newTables = tables.map((t: any) => {
      if (t.id === table.id) {
        return { ...table, rows: newRows };
      } else {
        return { ...t };
      }
    });
    setTables(newTables);
    console.log(tables, "table with curent data", countValue);
    handleCloseCategoryDialog();
  };

  const handleDeleteCategory = () => {
    if (row.parentId !== "") {
      const newRows = table.rows.map((r: any) => {
        if (r.id === row.parentId) {
          const newChildRow = r.childRow.filter((cId: any) => cId !== row.id);
          const newRow = { ...r, childRow: newChildRow };
          return newRow;
        } else return { ...r };
      });
      const newTable = tables.map((t: any) => {
        if (t.id === table.id) {
          return { ...table, rows: newRows };
        } else {
          return { ...t };
        }
      });
      setTables(newTable);
    } else {
      const newRows = table.rows.filter((r: any) => r.id !== row.id);
      const newTable = tables.map((t: any) => {
        if (t.id === table.id) {
          return { ...table, rows: newRows };
        } else {
          return { ...t };
        }
      });
      setTables(newTable);
    }
    // console.log(tables);
  };

  return (
    <>
      {row.childRow.length === 0 && (
        <TableRow key={row.id}>
          <TableCell sx={{ paddingX: "36px", paddingY: 0.5 }}>
            <p className="cell-p">
              {isEdit && (
                <Delete
                  color="error"
                  onClick={() => setOpenDelete(!openDelete)}
                />
              )}
              {row.title}
              {isEdit && (
                <AddCircle
                  onClick={() => setOpenAddCategory(!openAddCategory)}
                />
              )}
            </p>
          </TableCell>
          {row.rData.map((obj: any, index: number) => (
            <Cell
              key={index}
              data={obj}
              row={row}
              index={index}
              table={table}
              tables={tables}
              setTables={setTables}
              isEdit={isEdit}
            />
          ))}
        </TableRow>
      )}
      {row.childRow.length > 0 && (
        <TableRow>
          <TableCell colSpan={table.col.length + 1}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <p className="cell-p">
                          {isEdit && (
                            <Delete
                              color="error"
                              onClick={() => setOpenDelete(!openDelete)}
                            />
                          )}
                          {row.title}({row.childRow.length})
                          {isEdit && (
                            <AddCircle
                              onClick={() =>
                                setOpenAddCategory(!openAddCategory)
                              }
                            />
                          )}
                        </p>
                      </TableCell>
                      {row.rData.map((obj: any, index: number) => (
                        <Cell
                          key={index}
                          data={obj}
                          row={row}
                          index={index}
                          table={table}
                          tables={tables}
                          setTables={setTables}
                          isEdit={isEdit}
                        />
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </AccordionSummary>

              <AccordionDetails aria-expanded>
                <Table>
                  <TableBody>
                    {childRow?.length !== 0 &&
                      childRow?.map((cr) => (
                        <Row
                          key={cr.id}
                          row={cr}
                          table={table}
                          tables={tables}
                          setTables={setTables}
                          isEdit={isEdit}
                          countValue={countValue}
                          setCountValue={setCountValue}
                        />
                      ))}
                  </TableBody>
                </Table>
              </AccordionDetails>
            </Accordion>
          </TableCell>
        </TableRow>
      )}
      <Dialog
        onClose={handleCloseCategoryDialog}
        open={openAddCategory}
        // TransitionComponent={Transition}
        keepMounted
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="dialog-title">
          <h4 style={{ margin: "0" }}>Sub Category Name</h4>
          <Cancel
            color="error"
            onClick={handleCloseCategoryDialog}
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
            value={dCategoryV}
            onChange={(e) => setDCategoryV(e.target.value)}
          />
          <DialogActions>
            <div className="form-btn">
              <Button
                color="success"
                variant="outlined"
                onClick={() => handleAddRow()}
              >
                Save
              </Button>
              <Button
                color="warning"
                variant="outlined"
                onClick={handleCloseCategoryDialog}
              >
                Cancel
              </Button>
            </div>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Dialog open={openDelete} maxWidth="sm" fullWidth>
        <DialogTitle className="dialog-title">
          <h4 style={{ margin: 0 }}>DELETE</h4>
          <Cancel
            color="error"
            onClick={() => setOpenDelete(!openDelete)}
            className="cancel-logo"
          />
        </DialogTitle>
        <DialogContent className="dialog-cont">
          <DialogTitle className="dialog-title">
            <h4 style={{ margin: 0 }}>
              Are you sure you want to 'DELETE' this?
            </h4>
          </DialogTitle>
          <DialogActions>
            <div className="form-btn">
              <Button
                color="success"
                variant="outlined"
                onClick={() => handleDeleteCategory()}
              >
                Yes
              </Button>
              <Button
                color="warning"
                variant="outlined"
                onClick={() => setOpenDelete(!openDelete)}
              >
                No
              </Button>
            </div>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Row;
