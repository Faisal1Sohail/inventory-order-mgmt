import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid
} from '@mui/material';

// Email validator regex matching backend schema
const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

function CustomerForm({ open, onSave, onCancel }) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      name: '',
      phone: '',
      address: ''
    }
  });

  // Reset form when the modal opens
  useEffect(() => {
    if (open) {
      reset({
        email: '',
        name: '',
        phone: '',
        address: ''
      });
    }
  }, [open, reset]);

  const onSubmit = (data) => {
    // Sanitize phone/address fields if empty
    const formattedData = {
      ...data,
      phone: data.phone.trim() || null,
      address: data.address.trim() || null
    };
    onSave(formattedData);
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
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
        Register New Customer Profile
      </DialogTitle>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers sx={{ borderColor: '#2e3c60' }}>
          <Grid container spacing={2}>
            {/* Email Input */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Email address is required',
                  pattern: {
                    value: EMAIL_REGEX,
                    message: 'Invalid email address format'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email Address"
                    variant="outlined"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={{ input: { color: 'text.primary' } }}
                  />
                )}
              />
            </Grid>

            {/* Name Input */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Customer name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Full Name"
                    variant="outlined"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    sx={{ input: { color: 'text.primary' } }}
                  />
                )}
              />
            </Grid>

            {/* Phone Input */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone Number (Optional)"
                    variant="outlined"
                    fullWidth
                    sx={{ input: { color: 'text.primary' } }}
                  />
                )}
              />
            </Grid>

            {/* Address Input */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Billing Address (Optional)"
                    variant="outlined"
                    fullWidth
                    sx={{ input: { color: 'text.primary' } }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onCancel} color="inherit" sx={{ fontWeight: 600 }}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            color="primary" 
            variant="contained" 
            sx={{ fontWeight: 600, boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
          >
            Register Profile
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CustomerForm;
