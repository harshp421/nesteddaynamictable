import React,{useState} from 'react'
import { TablePropType } from '../utils/model.data'
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { v4 as uuid } from 'uuid';
import Nestedtable from './Nestedtable'

import { Cancel } from '@mui/icons-material';


const CustomeTable = () => {
    const [tables, setTables] = useState<TablePropType[]>([])

    const [isCreate, setIsCreate] = useState(false);
    const [tableName, setTableName] = useState<string>('');
    const [categoryName, setCategoryName] = useState<string>('');
    const [typeNames, setTypeNames] = useState<string[]>([]);
  
    //  for generating unique id
    const unique_id = uuid();
    const table_id = unique_id.slice(0, 8);


    // for opening model to show 
    const handleIsCreate = () => {
      setIsCreate(!isCreate);
    };
   
    // 
    const handleAddTypeNames = () => {
      setTypeNames([...typeNames, '']);
    };

    const handleResetForm = () => {
      setTableName('');
      setCategoryName('');
      setTypeNames([]);
    };
  
    const handleDeleteType = (index: number) => {
      const deletedTypes = typeNames.filter((t, i) => i !== index);
      setTypeNames(deletedTypes);
    };

    const handleCancel = () => {
      handleResetForm();
      handleIsCreate();
    };

    const handleSubmit = (e: { preventDefault: () => void }) => {
      e.preventDefault();
      const formData = {
        id: table_id,
        tName: tableName,
        cName: categoryName,
        col: typeNames,
        rows: [],
      };
      setTables((pd :any) => [...pd, formData]);
      handleCancel();
    };
  return (
    <>
   
    

    <div>CustomeTable</div>

    <div className="form-wrapper">
    <Button variant="contained" onClick={handleIsCreate}>
      Create Table
    </Button>
    <Dialog
      onClose={handleIsCreate}
      open={isCreate}
      
      keepMounted
    >
      <DialogTitle className="dialog-title">
        <h4>Enter Details To Create A Table</h4>
        <Cancel
          color="error"
          className="cancel-logo"
          onClick={handleCancel}
        />
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Table Name :"
            variant="outlined"
            value={tableName}
            required
            onChange={e => setTableName(e.target.value)}
          />
          <TextField
            label="Category Name :"
            variant="outlined"
            required
            value={categoryName}
            onChange={e => setCategoryName(e.target.value)}
          />
          {typeNames.length > 0 &&
            typeNames.map((t, index) => (
              <div className="type-form">
                <TextField
                  className="type-field"
                  key={index}
                  label="Type :"
                  variant="outlined"
                  value={t}
                  required
                  onChange={e =>
                    setTypeNames([
                      ...typeNames.slice(0, index),
                      e.target.value,
                      ...typeNames.slice(index + 1),
                    ])
                  }
                />
                <Cancel
                  className="cancel-type-icon"
                  color="error"
                  onClick={() => handleDeleteType(index)}
                />
              </div>
            ))}
         
        </form>
      </DialogContent>
      <DialogActions>
            <div className="form-btn">
              <Button
                onClick={handleAddTypeNames}
                variant="outlined"
                color="primary"
              >
                Add Types
              </Button>
              <Button
                onClick={handleResetForm}
                variant="outlined"
                color="warning"
              >
                Reset
              </Button>

              <Button onClick={handleCancel} variant="outlined" color="error">
                Cancel
              </Button>
              <Button type="submit" variant="outlined" color="success" onClick={handleSubmit}>
                Save
              </Button>
            </div>
          </DialogActions>
    </Dialog>
  </div>

  {tables.length > 0 &&
        tables.map(table => (
         <Nestedtable
         key={table.id}
         table={table}
         tables={tables}
         setTables={setTables}
         />
        ))}
  </>
  )
}

export default CustomeTable