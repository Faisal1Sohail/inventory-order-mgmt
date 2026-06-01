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
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

function ProductTable({ products, onEdit, onDelete }) {
  if (products.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#131b2e', border: '1px solid #2e3c60', borderRadius: 3 }}>
        <Typography variant="body1" color="text.secondary">
          No products registered in catalog.
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
            <TableCell>SKU</TableCell>
            <TableCell>Product Details</TableCell>
            <TableCell align="right">Unit Price</TableCell>
            <TableCell align="right">Current Stock</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((p) => {
            const isLowStock = p.stock_quantity <= 10;
            const isOutOfStock = p.stock_quantity === 0;

            return (
              <TableRow 
                key={p.id} 
                sx={{ 
                  '&:hover': { backgroundColor: '#1c2641' },
                  transition: 'background-color 0.2s ease'
                }}
              >
                {/* SKU Column */}
                <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                  {p.sku}
                </TableCell>

                {/* Name & Description Column */}
                <TableCell sx={{ fontWeight: 600 }}>
                  {p.name}
                  {p.description && (
                    <Typography variant="caption" display="block" color="text.secondary">
                      {p.description}
                    </Typography>
                  )}
                </TableCell>

                {/* Price Column */}
                <TableCell align="right" sx={{ fontWeight: 500 }}>
                  ${parseFloat(p.price).toFixed(2)}
                </TableCell>

                {/* Stock Level Column */}
                <TableCell 
                  align="right" 
                  sx={{ 
                    fontWeight: 700, 
                    color: isOutOfStock ? '#ef4444' : isLowStock ? '#f59e0b' : '#10b981' 
                  }}
                >
                  {p.stock_quantity} units
                </TableCell>

                {/* Status Column */}
                <TableCell>
                  <Chip 
                    label={isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "Healthy"}
                    size="small"
                    color={isOutOfStock ? "error" : isLowStock ? "warning" : "success"}
                    sx={{ fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase' }}
                  />
                </TableCell>

                {/* Action Buttons Column */}
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => onEdit(p)}
                      sx={{ '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.1)' } }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => onDelete(p)}
                      sx={{ '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' } }}
                    >
                      <DeleteIcon fontSize="small" />
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

export default ProductTable;
