import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box
} from '@mui/material';

function ProductForm({ open, product, onSave, onCancel }) {
  const isEdit = !!product;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      sku: '',
      name: '',
      description: '',
      price: '',
      stock_quantity: 0
    }
  });

  // Reset form when the modal opens or active product details change
  useEffect(() => {
    if (open) {
      if (product) {
        reset({
          sku: product.sku,
          name: product.name,
          description: product.description || '',
          price: product.price,
          stock_quantity: product.stock_quantity
        });
      } else {
        reset({
          sku: '',
          name: '',
          description: '',
          price: '',
          stock_quantity: 0
        });
      }
    }
  }, [open, product, reset]);

  const onSubmit = (data) => {
    // Convert numeric strings to standard values for backend validation compatibility
    const formattedData = {
      ...data,
      price: parseFloat(data.price),
      stock_quantity: parseInt(data.stock_quantity, 10)
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
        {isEdit ? 'Modify Catalog Product' : 'Add New Product'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers sx={{ borderColor: '#2e3c60' }}>
          <Grid container spacing={2}>
            {/* SKU Input */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="sku"
                control={control}
                rules={{
                  required: 'SKU is required',
                  pattern: {
                    value: /^\S+$/,
                    message: 'SKU cannot contain spaces'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="SKU Code"
                    variant="outlined"
                    fullWidth
                    disabled={isEdit} // Block editing SKU for data consistency
                    error={!!errors.sku}
                    helperText={errors.sku?.message}
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
                rules={{ required: 'Product name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Product Name"
                    variant="outlined"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    sx={{ input: { color: 'text.primary' } }}
                  />
                )}
              />
            </Grid>

            {/* Price Input */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="price"
                control={control}
                rules={{
                  required: 'Unit price is required',
                  min: {
                    value: 0.01,
                    message: 'Price must be greater than zero'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Unit Price ($)"
                    type="number"
                    inputProps={{ step: "0.01", min: "0" }}
                    variant="outlined"
                    fullWidth
                    error={!!errors.price}
                    helperText={errors.price?.message}
                    sx={{ input: { color: 'text.primary' } }}
                  />
                )}
              />
            </Grid>

            {/* Stock Level Input */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="stock_quantity"
                control={control}
                rules={{
                  required: 'Initial stock is required',
                  min: {
                    value: 0,
                    message: 'Stock cannot be negative'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Initial Stock Quantity"
                    type="number"
                    inputProps={{ min: "0", step: "1" }}
                    variant="outlined"
                    fullWidth
                    error={!!errors.stock_quantity}
                    helperText={errors.stock_quantity?.message}
                    sx={{ input: { color: 'text.primary' } }}
                  />
                )}
              />
            </Grid>

            {/* Description Input */}
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Product Description (Optional)"
                    multiline
                    rows={3}
                    variant="outlined"
                    fullWidth
                    sx={{ textarea: { color: 'text.primary' } }}
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
            {isEdit ? 'Save Changes' : 'Add Product'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ProductForm;
