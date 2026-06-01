import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

function ConfirmDeleteModal({ open, title, content, onConfirm, onCancel }) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        sx: {
          backgroundColor: '#131b2e',
          border: '1px solid #2e3c60',
          borderRadius: 3,
          p: 1
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, color: 'text.primary' }}>
        {title || 'Confirm Delete'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
          {content || 'Are you sure you want to delete this listing? This action cannot be undone.'}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} color="inherit" sx={{ fontWeight: 600 }}>
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          color="error" 
          variant="contained"
          sx={{ fontWeight: 600, boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
        >
          Delete Permanently
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDeleteModal;
