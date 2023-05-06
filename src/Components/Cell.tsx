import React from "react";
import { TableCell, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { MyRowCellProps } from "../utils/model.data";

const Cell = ({
  isEdit,
  table,
  tables,
  setTables,
  index,
  row,
  data,
}: MyRowCellProps) => {
  /** saving single cell value in that cell with this state */
  const [count, setCount] = useState(`${data.value}`);

  const arrayRows = table.rows.filter((r) => row.childRow.includes(r.id));
  const arrayData = arrayRows.map((r) => {
    return r.rData[index];
  });
  const sum = arrayData
    .flatMap((array) => array)
    .reduce((total, obj) => total + obj?.value, 0);

  useEffect(() => {
    if (row.childRow.length === 1) {
      data.value = 0;
      setCount("0");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row.childRow.length]);

  useEffect(() => {
    arrayRows.map((r) => {
      if (sum === 0) {
        data.value = 0;
        setCount("0");
        return data?.value;
      } else {
        return null;
      }
    });
  }, [arrayRows, data, sum]);

  useEffect(() => {
    if (row.childRow.length === 0) {
      const newRowData = row.rData.map((c, i) => {
        if (i === index) {
          return { type: c.type, value: parseInt(count) };
        } else {
          return c;
        }
      });

      const newRows = table.rows.map((r) => {
        if (r.id === row.id) {
          return { ...row, rData: newRowData };
        } else return { ...r };
      });
      const newTables = tables.map((t) => {
        if (t.id === table.id) {
          return { ...table, rows: newRows };
        } else {
          return { ...t };
        }
      });
      setTables(newTables);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, sum]);

  //console.log(table, "table");

  useEffect(() => {
    if (row.childRow.length > 0) {
      const arrayOfRows = table.rows.filter((r) => row.childRow.includes(r.id));
      const arrayOfData = arrayOfRows.map((r) => {
        return r.rData[index];
      });
      const sum = arrayOfData
        .flatMap((array) => array)
        .reduce((total, obj) => total + obj?.value, 0);

      const updatedRowData = row.rData.map((c, i) => {
        if (i === index) {
          return { type: c.type, value: sum };
        } else {
          return c;
        }
      });
      const newRows = table.rows.map((r) => {
        if (r.id === row.id) {
          return { ...row, rData: updatedRowData };
        } else return { ...r };
      });

      const newTables = tables.map((t) => {
        if (t.id === table.id) {
          return { ...table, rows: newRows };
        } else {
          return { ...t };
        }
      });
      setTables(newTables);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sum]);

  return (
    <>
      {!isEdit && (
        <TableCell>
          {Number.isNaN(data.value) && "0"}
          {!Number.isNaN(data.value) && data.value}
        </TableCell>
      )}
      {isEdit && row.childRow.length > 0 && (
        <TableCell>
          <TextField
            type="text"
            size="small"
            margin="dense"
            value={(Number.isNaN(data?.value) && "0") || data.value}
          />
        </TableCell>
      )}
      {isEdit && row.childRow.length === 0 && (
        <TableCell sx={{ paddingX: "36px", paddingY: 0.5 }}>
          <TextField
            type="number"
            variant="standard"
            size="small"
            margin="dense"
            value={data.value === 0 ? "0" : count}
            onChange={(e) => setCount(e.target.value)}
          />
        </TableCell>
      )}
    </>
  );
};

export default Cell;
