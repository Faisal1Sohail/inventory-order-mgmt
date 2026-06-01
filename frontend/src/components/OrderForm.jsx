import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  IconButton,
  TextField,
  Box,
  Divider,
  FormHelperText
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

function OrderForm({ open, customers, products, onSave, onCancel }) {
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [orderItems, setOrderItems] = useState([{ product_id: '', quantity: 1 }]);
  const [formErrors, setFormErrors] = useState({});
  const [orderTotal, setOrderTotal] = useState(0);

  // Reset form states when modal opens
  useEffect(() => {
    if (open) {
      setSelectedCustomerId('');
      setOrderItems([{ product_id: '', quantity: 1 }]);
      setFormErrors({});
      setOrderTotal(0);
    }
  }, [open]);

  // Recalculate auto total whenever products or quantities change
  useEffect(() => {
    let runningTotal = 0;
    orderItems.forEach(item => {
      if (item.product_id) {
        const prod = products.find(p => p.id === item.product_id);
        if (prod) {
          runningTotal += parseFloat(prod.price) * item.quantity;
        }
      }
    });
    setOrderTotal(runningTotal);
  }, [orderItems, products]);

  const handleCustomerChange = (e) => {
    setSelectedCustomerId(e.target.value);
    setFormErrors(prev => ({ ...prev, customer: null }));
  };

  const handleProductChange = (index, productId) => {
    const updated = [...orderItems];
    updated[index].product_id = productId;
    
    // Set default quantity to 1 if empty
    if (!updated[index].quantity) {
      updated[index].quantity = 1;
    }
    
    setOrderItems(updated);
    setFormErrors(prev => ({ ...prev, items: null }));
  };

  const handleQuantityChange = (index, quantityStr) => {
    const qty = parseInt(quantityStr, 10) || 0;
    const updated = [...orderItems];
    updated[index].quantity = qty;
    setOrderItems(updated);
  };

  const handleAddLine = () => {
    setOrderItems(prev => [...prev, { product_id: '', quantity: 1 }]);
  };

  const handleRemoveLine = (index) => {
    const updated = orderItems.filter((_, idx) => idx !== index);
    // Guarantee at least one line remains
    setOrderItems(updated.length > 0 ? updated : [{ product_id: '', quantity: 1 }]);
  };

  const validateForm = () => {
    const errors = {};
    if (!selectedCustomerId) {
      errors.customer = 'Please select a customer.';
    }

    const itemErrors = [];
    let hasItems = false;

    orderItems.forEach((item, idx) => {
      if (!item.product_id) {
        itemErrors[idx] = { product_id: 'Please select a product.' };
      } else {
        hasItems = true;
        const prod = products.find(p => p.id === item.product_id);
        if (!prod) {
          itemErrors[idx] = { product_id: 'Product not found.' };
        } else {
          if (item.quantity <= 0) {
            itemErrors[idx] = { quantity: 'Quantity must be greater than zero.' };
          } else if (item.quantity > prod.stock_quantity) {
            itemErrors[idx] = { quantity: `Stock shortage. Available: ${prod.stock_quantity} units.` };
          }
        }
      }
    });

    if (itemErrors.some(e => e !== undefined)) {
      errors.items = itemErrors;
    }
    if (!hasItems) {
      errors.general = 'Order must contain at least one valid product line.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Package output
    const filteredItems = orderItems
      .filter(item => item.product_id !== '')
      .map(item => ({
        product_id: item.product_id,
        quantity: item.quantity
      }));

    onSave({
      customer_id: selectedCustomerId,
      items: filteredItems
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="md"
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
      <DialogTitle sx={{ fontWeight: 700, color: 'text.primary', pb: 1 }}>
        Place Checkout Order
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ borderColor: '#2e3c60' }}>
          
          {/* Customer Selection Dropdown */}
          <FormControl 
            fullWidth 
            error={!!formErrors.customer}
            sx={{ mb: 4 }}
          >
            <InputLabel id="customer-select-label">Select Customer Profile</InputLabel>
            <Select
              labelId="customer-select-label"
              value={selectedCustomerId}
              label="Select Customer Profile"
              onChange={handleCustomerChange}
              sx={{ color: 'text.primary' }}
            >
              {customers.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name} ({c.email})
                </MenuItem>
              ))}
            </Select>
            {formErrors.customer && <FormHelperText>{formErrors.customer}</FormHelperText>}
          </FormControl>

          <Typography variant="h6" color="text.primary" sx={{ mb: 2, fontWeight: 600 }}>
            Order Line Items
          </Typography>

          {/* Dynamic Item Add Lines */}
          <Grid container spacing={2}>
            {orderItems.map((item, index) => {
              const selectedProd = products.find(p => p.id === item.product_id);
              const availableStock = selectedProd ? selectedProd.stock_quantity : 0;
              const hasStockError = formErrors.items?.[index]?.quantity;
              const hasProdError = formErrors.items?.[index]?.product_id;

              return (
                <React.Fragment key={index}>
                  {/* Product Selection */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!hasProdError}>
                      <InputLabel id={`product-select-label-${index}`}>Product</InputLabel>
                      <Select
                        labelId={`product-select-label-${index}`}
                        value={item.product_id}
                        label="Product"
                        onChange={(e) => handleProductChange(index, e.target.value)}
                        sx={{ color: 'text.primary' }}
                      >
                        {products.map((p) => {
                          const isAlreadyAdded = orderItems.some((oi, oiIdx) => oi.product_id === p.id && oiIdx !== index);
                          return (
                            <MenuItem 
                              key={p.id} 
                              value={p.id}
                              disabled={isAlreadyAdded || p.stock_quantity === 0}
                            >
                              {p.name} (SKU: {p.sku}) - ${parseFloat(p.price).toFixed(2)} {p.stock_quantity === 0 && "[OUT OF STOCK]"}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {hasProdError && <FormHelperText>{hasProdError}</FormHelperText>}
                    </FormControl>
                  </Grid>

                  {/* Quantity Input */}
                  <Grid item xs={8} sm={4}>
                    <TextField
                      label="Quantity"
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      error={!!hasStockError}
                      helperText={
                        hasStockError || 
                        (selectedProd ? `Available stock: ${availableStock} units` : '')
                      }
                      fullWidth
                      inputProps={{ min: "1" }}
                    />
                  </Grid>

                  {/* Delete Item Line Button */}
                  <Grid item xs={4} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton 
                      color="error" 
                      onClick={() => handleRemoveLine(index)}
                      sx={{ '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' } }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1, borderColor: '#2e3c60', opacity: 0.5 }} />
                  </Grid>
                </React.Fragment>
              );
            })}
          </Grid>

          {formErrors.general && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
              {formErrors.general}
            </Alert>
          )}

          {/* Add Line Item Button */}
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddLine}
            variant="outlined"
            color="primary"
            sx={{ mt: 2, fontWeight: 600 }}
          >
            Add Product Line
          </Button>

          {/* Auto Calculated Order Total */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, p: 2, backgroundColor: '#0b0f19', borderRadius: 2, border: '1px solid #2e3c60' }}>
            <Typography variant="h6" color="text.secondary" sx={{ mr: 2, fontWeight: 500 }}>
              Auto Total Calculation:
            </Typography>
            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800 }}>
              ${orderTotal.toFixed(2)}
            </Typography>
          </Box>

        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onCancel} color="inherit" sx={{ fontWeight: 600 }}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            color="success" 
            variant="contained" 
            sx={{ fontWeight: 600, boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
          >
            Checkout Order
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default OrderForm;
