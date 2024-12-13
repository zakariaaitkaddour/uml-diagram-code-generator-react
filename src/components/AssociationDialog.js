import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const AssociationDialog = ({ open, onClose, associationDetails, setAssociationDetails, handleAddAssociation }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Add Association</DialogTitle>
    <DialogContent>
      <FormControl fullWidth>
        <InputLabel>Association Type</InputLabel>
        <Select
          value={associationDetails.associationType}
          onChange={(e) => setAssociationDetails((prev) => ({ ...prev, associationType: e.target.value }))}
        >
          <MenuItem value="inheritance">Inheritance</MenuItem>
          <MenuItem value="aggregation">Aggregation</MenuItem>
          <MenuItem value="composition">Composition</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Multiplicity (optional)"
        value={associationDetails.multiplicity}
        onChange={(e) => setAssociationDetails((prev) => ({ ...prev, multiplicity: e.target.value }))}
        fullWidth
        style={{ marginTop: '10px' }}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button variant="contained" onClick={handleAddAssociation}>Add</Button>
    </DialogActions>
  </Dialog>
);

export default AssociationDialog;
