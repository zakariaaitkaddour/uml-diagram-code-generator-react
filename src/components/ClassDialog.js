import React from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';

const ClassDialog = ({ open, onClose, newClassName, setNewClassName, handleAddClass }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Add Class</DialogTitle>
    <DialogContent>
      <TextField
        label="Class Name"
        value={newClassName}
        onChange={(e) => setNewClassName(e.target.value)}
        fullWidth
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button variant="contained" onClick={handleAddClass}>Add</Button>
    </DialogActions>
  </Dialog>
);

export default ClassDialog;
