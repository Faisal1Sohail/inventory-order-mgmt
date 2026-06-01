import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Chip,
  Box
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

function OrderTable({ orders, customers, onDetails, onCancel }) {
  if (orders.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#131b2e', border: '1px solid #2e3c60', borderRadius: 3 }}>
        <Typography variant="body1" color="text.secondary">
          No orders placed in system.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        backgroundColor: '#131b2e', 
        border: '1px solid #2e3c60', 
        borderRadius: 3,
        overflow: 'hidden'
      }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Customer Profile</TableCell>
            <TableCell align="right">Total Value</TableCell>
            <TableCell>Purchase Date</TableCell>
            <TableCell>Order Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((o) => {
            const cust = customers.find(c => c.id === o.customer_id);
            const isCancelled = o.status === 'cancelled';
            const isShipped = o.status === 'shipped';

            return (
              <TableRow 
                key={o.id} 
                sx={{ 
                  '&:hover': { backgroundColor: '#1c2641' },
                  transition: 'background-color 0.2s ease'
                }}
              >
                {/* Monospace Order ID Column */}
                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 600 }}>
                  {o.id}
                </TableCell>

                {/* Customer Info Column */}
                <TableCell sx={{ fontWeight: 600 }}>
                  {cust ? cust.name : 'Unknown Customer'}
                  {cust && (
                    <Typography variant="caption" display="block" color="text.secondary">
                      {cust.email}
                    </Typography>
                  )}
                </TableCell>

                {/* Value Column */}
                <TableCell align="right" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                  ${parseFloat(o.total_amount).toFixed(2)}
                </TableCell>

                {/* Date Column */}
                <TableCell>
                  {new Date(o.created_at).toLocaleString()}
                </TableCell>

                {/* Status Column */}
                <TableCell>
                  <Chip 
                    label={o.status}
                    size="small"
                    color={
                      o.status === 'shipped' ? 'success' : 
                      o.status === 'cancelled' ? 'error' : 'warning'
                    }
                    sx={{ fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase' }}
                  />
                </TableCell>

                {/* Action Buttons Column */}
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    {/* View Details Receipt Button */}
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => onDetails(o)}
                      sx={{ '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.1)' } }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    
                    {/* Cancel Order Button */}
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => onCancel(o)}
                      disabled={isCancelled || isShipped}
                      sx={{ 
                        '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
                        opacity: (isCancelled || isShipped) ? 0.3 : 1
                      }}
                    >
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default OrderTable;
