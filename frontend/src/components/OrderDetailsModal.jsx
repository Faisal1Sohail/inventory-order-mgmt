import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Divider,
  Grid,
  Chip
} from '@mui/material';

function OrderDetailsModal({ open, order, customer, products, onClose }) {
  if (!order) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        Order Specifications Receipt
      </DialogTitle>
      
      <DialogContent sx={{ mt: 1 }}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Order Details */}
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, backgroundColor: '#0b0f19', border: '1px solid #2e3c60', borderRadius: 2 }} elevation={0}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Order Identifiers
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 1, wordBreak: 'break-all' }}>
                ID: {order.id}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Date Placed: {new Date(order.created_at).toLocaleString()}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
                <Typography variant="body2">Status:</Typography>
                <Chip 
                  label={order.status} 
                  color={
                    order.status === 'shipped' ? 'success' : 
                    order.status === 'cancelled' ? 'error' : 'warning'
                  }
                  size="small"
                  sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.6875rem' }}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Customer Details */}
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, backgroundColor: '#0b0f19', border: '1px solid #2e3c60', borderRadius: 2 }} elevation={0}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Customer Contact
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                {customer ? customer.name : 'Unknown Customer'}
              </Typography>
              <Typography variant="body2" color="secondary" sx={{ mb: 0.5 }}>
                Email: {customer ? customer.email : 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Phone: {customer ? customer.phone || 'N/A' : 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Address: {customer ? customer.address || 'N/A' : 'N/A'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Typography variant="h6" color="text.primary" sx={{ mb: 1.5, fontWeight: 600 }}>
          Purchased Line Items
        </Typography>

        {/* Itemized Table */}
        <TableContainer 
          component={Paper} 
          sx={{ 
            backgroundColor: '#0b0f19', 
            border: '1px solid #2e3c60', 
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SKU</TableCell>
                <TableCell>Product Details</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Unit Price</TableCell>
                <TableCell align="right">Total Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items.map((item) => {
                const prod = products.find(p => p.id === item.product_id);
                const itemTotal = parseFloat(item.unit_price) * item.quantity;

                return (
                  <TableRow key={item.id} sx={{ '&:hover': { backgroundColor: '#1c2641' } }}>
                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                      {prod ? prod.sku : 'PROD-SKU'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {prod ? prod.name : 'Unknown Product'}
                      {prod && prod.description && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          {prod.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      {item.quantity} units
                    </TableCell>
                    <TableCell align="right">
                      ${parseFloat(item.unit_price).toFixed(2)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                      ${itemTotal.toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })}
              
              {/* Checkout Total Row */}
              <TableRow>
                <TableCell colSpan={3} border={0} />
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: '1rem', borderBottom: 'none' }}>
                  Total Value:
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, fontSize: '1.2rem', color: 'primary.main', borderBottom: 'none' }}>
                  ${parseFloat(order.total_amount).toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="primary" variant="contained" sx={{ fontWeight: 600, boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}>
          Close Receipt
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OrderDetailsModal;
