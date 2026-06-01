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
  Box
} from '@mui/material';
import {
  Delete as DeleteIcon
} from '@mui/icons-material';

function CustomerTable({ customers, onDelete }) {
  if (customers.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#131b2e', border: '1px solid #2e3c60', borderRadius: 3 }}>
        <Typography variant="body1" color="text.secondary">
          No customers registered in database.
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
            <TableCell>Customer Details</TableCell>
            <TableCell>Email Address</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell>Billing/Shipping Address</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((c) => (
            <TableRow 
              key={c.id} 
              sx={{ 
                '&:hover': { backgroundColor: '#1c2641' },
                transition: 'background-color 0.2s ease'
              }}
            >
              {/* Name Details Column */}
              <TableCell sx={{ fontWeight: 600 }}>
                {c.name}
              </TableCell>

              {/* Email Column */}
              <TableCell sx={{ color: 'secondary.main', fontWeight: 500 }}>
                {c.email}
              </TableCell>

              {/* Phone Column */}
              <TableCell>
                {c.phone || 'N/A'}
              </TableCell>

              {/* Address Column */}
              <TableCell sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>
                {c.address || 'N/A'}
              </TableCell>

              {/* Actions Column */}
              <TableCell align="center">
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => onDelete(c)}
                    sx={{ '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default CustomerTable;
