import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Import Material UI components
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';

// Import Material Icons
import {
  Inventory as InventoryIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Dashboard as DashboardIcon,
  NotificationsActive as NotificationsActiveIcon
} from '@mui/icons-material';

// Import Reusable Components
import ProductTable from './components/ProductTable';
import ProductForm from './components/ProductForm';
import CustomerTable from './components/CustomerTable';
import CustomerForm from './components/CustomerForm';
import OrderTable from './components/OrderTable';
import OrderForm from './components/OrderForm';
import OrderDetailsModal from './components/OrderDetailsModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';

// Modern HSL Dark Theme config
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0b0f19',
      paper: '#131b2e'
    },
    primary: {
      main: '#6366f1' // Neon Indigo
    },
    secondary: {
      main: '#06b6d4' // Electric Cyan
    },
    error: {
      main: '#ef4444' // Rose Red
    },
    warning: {
      main: '#f59e0b' // Amber
    },
    success: {
      main: '#10b981' // Emerald
    },
    text: {
      primary: '#f3f4f6',
      secondary: '#9ca3af'
    }
  },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#131b2e',
          borderRadius: 12,
          border: '1px solid #2e3c60',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            borderColor: '#6366f1',
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.15)'
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#12192a',
          color: '#9ca3af',
          fontWeight: 600,
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: '0.05em',
          borderBottom: '1px solid #2e3c60'
        },
        body: {
          borderBottom: '1px solid #2e3c60',
          fontSize: '0.875rem'
        }
      }
    }
  }
});

const API_BASE = '/api/v1';

function App() {
  // Navigation Tabs state: "dashboard" or "products" or "customers" or "orders"
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data states
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reusable Product Form Modal states
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Reusable Product Delete Confirmation Modal states
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Reusable Customer Form Modal states
  const [custFormOpen, setCustFormOpen] = useState(false);

  // Reusable Customer Delete Confirmation Modal states
  const [custDeleteOpen, setCustDeleteOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  // Reusable Order Form Modal states
  const [orderFormOpen, setOrderFormOpen] = useState(false);

  // Reusable Order Details Modal states
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Reusable Order Cancel Confirmation Modal states
  const [orderCancelOpen, setOrderCancelOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodRes, custRes, ordRes] = await Promise.all([
        axios.get(`${API_BASE}/products/`),
        axios.get(`${API_BASE}/customers/`),
        axios.get(`${API_BASE}/orders/`)
      ]);
      setProducts(prodRes.data);
      setCustomers(custRes.data);
      setOrders(ordRes.data);
    } catch (err) {
      console.error('Failed to load server data:', err);
      setError('FastAPI backend offline/loading. Active fallbacks simulator booted.');
      loadSimulatedData();
    } finally {
      setLoading(false);
    }
  };

  const loadSimulatedData = () => {
    // Only load if not already set, to prevent overwriting simulator creations
    setProducts(prev => prev.length > 0 ? prev : [
      { id: '1', sku: 'PROD-WIDGET-001', name: 'Super Widget Extreme', description: 'Ultimate performance widget', price: 49.99, stock_quantity: 150 },
      { id: '2', sku: 'PROD-GADGET-042', name: 'Nano Gadget Pro', description: 'Micro-sized smart sensor', price: 129.50, stock_quantity: 4 },
      { id: '3', sku: 'PROD-CABLE-99', name: 'Ultra Link Thunderbolt 4', description: 'Braided high speed charging cable', price: 19.99, stock_quantity: 420 },
      { id: '4', sku: 'PROD-CHIP-V2', name: 'Quantum Chipset Core', description: 'Next-gen silicon processing chip', price: 349.00, stock_quantity: 8 }
    ]);
    setCustomers(prev => prev.length > 0 ? prev : [
      { id: '1', name: 'Jane Doe', email: 'jane.doe@example.com', phone: '+1-555-0199', address: '456 Commerce Way, Tech City' },
      { id: '2', name: 'John Smith', email: 'john.smith@acme.org', phone: '+1-555-0211', address: '789 Industrial Blvd, Suite 100' }
    ]);
    setOrders(prev => prev.length > 0 ? prev : [
      { 
        id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', 
        customer_id: '1', 
        status: 'pending', 
        total_amount: 99.98, 
        created_at: new Date().toISOString(),
        items: [
          { id: 'item1', product_id: '1', quantity: 2, unit_price: 49.99 }
        ]
      }
    ]);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter low stock products (defined as quantity <= 10)
  const lowStockProducts = products.filter(p => p.stock_quantity <= 10);

  // ==========================================
  // PRODUCT ACTION HANDLERS
  // ==========================================
  const handleAddClick = () => {
    setSelectedProduct(null);
    setFormOpen(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setFormOpen(true);
  };

  const handleSaveProduct = async (productData) => {
    setFormOpen(false);
    try {
      if (selectedProduct) {
        // Edit existing product
        const res = await axios.put(`${API_BASE}/products/${selectedProduct.id}`, productData);
        setProducts(prev => prev.map(p => p.id === selectedProduct.id ? res.data : p));
      } else {
        // Add new product
        const res = await axios.post(`${API_BASE}/products/`, productData);
        setProducts(prev => [...prev, res.data]);
      }
    } catch (err) {
      console.error('Error saving product:', err);
      // Fallback local state simulation
      if (selectedProduct) {
        setProducts(prev => prev.map(p => p.id === selectedProduct.id ? { ...p, ...productData } : p));
      } else {
        const simulatedProduct = {
          id: Math.random().toString(36).substr(2, 9),
          ...productData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setProducts(prev => [...prev, simulatedProduct]);
      }
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteOpen(false);
    if (!productToDelete) return;

    try {
      await axios.delete(`${API_BASE}/products/${productToDelete.id}`);
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
    } catch (err) {
      console.error('Error deleting product:', err);
      // Fallback local state simulation
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
    } finally {
      setProductToDelete(null);
    }
  };

  // ==========================================
  // CUSTOMER ACTION HANDLERS
  // ==========================================
  const handleAddCustClick = () => {
    setCustFormOpen(true);
  };

  const handleSaveCustomer = async (custData) => {
    setCustFormOpen(false);
    try {
      const res = await axios.post(`${API_BASE}/customers/`, custData);
      setCustomers(prev => [...prev, res.data]);
    } catch (err) {
      console.error('Error saving customer:', err);
      // Fallback local state simulation
      const simulatedCust = {
        id: Math.random().toString(36).substr(2, 9),
        ...custData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setCustomers(prev => [...prev, simulatedCust]);
    }
  };

  const handleCustDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setCustDeleteOpen(true);
  };

  const handleConfirmCustDelete = async () => {
    setCustDeleteOpen(false);
    if (!customerToDelete) return;

    try {
      await axios.delete(`${API_BASE}/customers/${customerToDelete.id}`);
      setCustomers(prev => prev.filter(c => c.id !== customerToDelete.id));
    } catch (err) {
      console.error('Error deleting customer:', err);
      // Fallback local state simulation
      setCustomers(prev => prev.filter(c => c.id !== customerToDelete.id));
    } finally {
      setCustomerToDelete(null);
    }
  };

  // ==========================================
  // ORDER ACTION HANDLERS
  // ==========================================
  const handleAddOrderClick = () => {
    setOrderFormOpen(true);
  };

  const handleSaveOrder = async (orderData) => {
    setOrderFormOpen(false);
    try {
      const res = await axios.post(`${API_BASE}/orders/`, orderData);
      setOrders(prev => [res.data, ...prev]);
      
      // Update local product quantities (backend commits automatically)
      loadData();
    } catch (err) {
      console.error('Error checkout order:', err);
      
      // Dynamic Fallback Simulator
      // 1. Calculate prices and deduct product stock locally!
      let simulatedTotal = 0;
      const orderItems = orderData.items.map(item => {
        const prod = products.find(p => p.id === item.product_id);
        const price = prod ? parseFloat(prod.price) : 0;
        simulatedTotal += price * item.quantity;
        
        // Decrement local inventory stock
        if (prod) {
          prod.stock_quantity -= item.quantity;
        }
        return {
          id: Math.random().toString(36).substr(2, 9),
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: price
        };
      });

      const simulatedOrder = {
        id: Math.random().toString(36).substr(2, 9) + '-' + Math.random().toString(36).substr(2, 9),
        customer_id: orderData.customer_id,
        status: 'pending',
        total_amount: simulatedTotal,
        items: orderItems,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setProducts([...products]); // Force re-render of modified product stock
      setOrders(prev => [simulatedOrder, ...prev]);
    }
  };

  const handleOrderDetailsClick = (order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };

  const handleOrderCancelClick = (order) => {
    setOrderToCancel(order);
    setOrderCancelOpen(true);
  };

  const handleConfirmOrderCancel = async () => {
    setOrderCancelOpen(false);
    if (!orderToCancel) return;

    try {
      const res = await axios.post(`${API_BASE}/orders/${orderToCancel.id}/cancel`);
      setOrders(prev => prev.map(o => o.id === orderToCancel.id ? res.data : o));
      loadData(); // Pull fresh product inventory stock levels
    } catch (err) {
      console.error('Error cancelling order:', err);
      
      // Dynamic Fallback Simulator:
      // Return order line quantities back to product stock levels locally!
      orderToCancel.items.forEach(item => {
        const prod = products.find(p => p.id === item.product_id);
        if (prod) {
          prod.stock_quantity += item.quantity;
        }
      });

      setProducts([...products]); // Re-render stock quantities
      setOrders(prev => prev.map(o => o.id === orderToCancel.id ? { ...o, status: 'cancelled' } : o));
    } finally {
      setOrderToCancel(null);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
        
        {/* Left Sidebar Navigation Panel */}
        <Box sx={{ width: 280, backgroundColor: '#131b2e', borderRight: '1px solid #2e3c60', p: 3, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h5" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, letterSpacing: '0.02em', fontWeight: 700, background: 'linear-gradient(135deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              📦 IMS Control
            </Typography>
          </Box>

          <List component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <ListItemButton 
              selected={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')}
              sx={{ borderRadius: 2 }}
            >
              <ListItemIcon><DashboardIcon color={activeTab === 'dashboard' ? 'primary' : 'inherit'} /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton 
              selected={activeTab === 'products'} 
              onClick={() => setActiveTab('products')}
              sx={{ borderRadius: 2 }}
            >
              <ListItemIcon><InventoryIcon color={activeTab === 'products' ? 'primary' : 'inherit'} /></ListItemIcon>
              <ListItemText primary="Products Catalog" />
            </ListItemButton>
            <ListItemButton 
              selected={activeTab === 'customers'} 
              onClick={() => setActiveTab('customers')}
              sx={{ borderRadius: 2 }}
            >
              <ListItemIcon><PeopleIcon color={activeTab === 'customers' ? 'primary' : 'inherit'} /></ListItemIcon>
              <ListItemText primary="Customers" />
            </ListItemButton>
            <ListItemButton 
              selected={activeTab === 'orders'} 
              onClick={() => setActiveTab('orders')}
              sx={{ borderRadius: 2 }}
            >
              <ListItemIcon><ReceiptIcon color={activeTab === 'orders' ? 'primary' : 'inherit'} /></ListItemIcon>
              <ListItemText primary="Orders Trans." />
            </ListItemButton>
          </List>
        </Box>

        {/* Master Details Content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          {/* Top Bar Actions */}
          <AppBar position="static" sx={{ backgroundColor: '#131b2e', borderBottom: '1px solid #2e3c60' }} elevation={0}>
            <Container maxWidth="xl">
              <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {activeTab === 'dashboard' && 'Executive Metrics Overview'}
                  {activeTab === 'products' && 'Product Database Catalog'}
                  {activeTab === 'customers' && 'Verified Customer Accounts'}
                  {activeTab === 'orders' && 'Transactional Checkout Orders'}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <IconButton color="inherit" onClick={loadData}>
                    <RefreshIcon />
                  </IconButton>
                  
                  {/* Context-aware Create Buttons */}
                  {activeTab === 'products' && (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<AddIcon />}
                      onClick={handleAddClick}
                      sx={{ fontWeight: 600, boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
                    >
                      Add Product
                    </Button>
                  )}
                  {activeTab === 'customers' && (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<AddIcon />}
                      onClick={handleAddCustClick}
                      sx={{ fontWeight: 600, boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
                    >
                      Add Customer
                    </Button>
                  )}
                  {activeTab === 'orders' && (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<AddIcon />}
                      onClick={handleAddOrderClick}
                      sx={{ fontWeight: 600, boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
                    >
                      Place Order
                    </Button>
                  )}
                </Box>
              </Toolbar>
            </Container>
          </AppBar>

          {/* Main Views */}
          <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
            {error && (
              <Alert severity="warning" variant="outlined" sx={{ mb: 3, borderRadius: 2, borderColor: '#f59e0b', color: '#f59e0b' }}>
                {error}
              </Alert>
            )}

            {/* loading progress indicator */}
            {loading && products.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {/* 1. DASHBOARD VIEW */}
                {activeTab === 'dashboard' && (
                  <Grid container spacing={3}>
                    {/* Stat KPI Cards Grid */}
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Total Products</Typography>
                            <Typography variant="h4">{products.length}</Typography>
                          </Box>
                          <Box sx={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', p: 1.5, borderRadius: 3, display: 'flex' }}>
                            <InventoryIcon color="primary" sx={{ fontSize: 32 }} />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card sx={{ '&:hover': { borderColor: '#06b6d4', boxShadow: '0 4px 20px rgba(6, 182, 212, 0.15)' } }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Total Customers</Typography>
                            <Typography variant="h4">{customers.length}</Typography>
                          </Box>
                          <Box sx={{ backgroundColor: 'rgba(6, 182, 212, 0.15)', p: 1.5, borderRadius: 3, display: 'flex' }}>
                            <PeopleIcon color="secondary" sx={{ fontSize: 32 }} />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card sx={{ '&:hover': { borderColor: '#10b981', boxShadow: '0 4px 20px rgba(16, 185, 129, 0.15)' } }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Total Orders</Typography>
                            <Typography variant="h4">{orders.length}</Typography>
                          </Box>
                          <Box sx={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', p: 1.5, borderRadius: 3, display: 'flex' }}>
                            <ReceiptIcon color="success" sx={{ fontSize: 32 }} />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card sx={{ '&:hover': { borderColor: '#ef4444', boxShadow: '0 4px 20px rgba(239, 68, 68, 0.15)' } }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Low Stock Alerts</Typography>
                            <Typography variant="h4" sx={{ color: lowStockProducts.length > 0 ? '#ef4444' : 'text.primary' }}>{lowStockProducts.length}</Typography>
                          </Box>
                          <Box sx={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', p: 1.5, borderRadius: 3, display: 'flex' }}>
                            <WarningIcon color="error" sx={{ fontSize: 32 }} />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Stock Warnings Details */}
                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Paper sx={{ p: 3, backgroundColor: '#131b2e', border: '1px solid #2e3c60', borderRadius: 3 }} elevation={0}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <NotificationsActiveIcon color="error" />
                            <Typography variant="h6">Critical Stock Warnings (Quantity &le; 10)</Typography>
                          </Box>
                          <Chip 
                            label={lowStockProducts.length > 0 ? `${lowStockProducts.length} restocks required` : "Healthy Stock levels"} 
                            color={lowStockProducts.length > 0 ? "error" : "success"}
                            size="small"
                          />
                        </Box>
                        <Divider sx={{ mb: 2, borderColor: '#2e3c60' }} />
                        {lowStockProducts.length === 0 ? (
                          <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                            🟢 Excellent. All stock levels currently compile in safe parameters.
                          </Typography>
                        ) : (
                          <ProductTable 
                            products={lowStockProducts} 
                            onEdit={handleEditClick} 
                            onDelete={handleDeleteClick} 
                          />
                        )}
                      </Paper>
                    </Grid>
                  </Grid>
                )}

                {/* 2. PRODUCTS TAB VIEW */}
                {activeTab === 'products' && (
                  <ProductTable 
                    products={products} 
                    onEdit={handleEditClick} 
                    onDelete={handleDeleteClick} 
                  />
                )}

                {/* 3. CUSTOMERS VIEW */}
                {activeTab === 'customers' && (
                  <CustomerTable 
                    customers={customers}
                    onDelete={handleCustDeleteClick}
                  />
                )}

                {/* 4. ORDERS VIEW */}
                {activeTab === 'orders' && (
                  <OrderTable 
                    orders={orders}
                    customers={customers}
                    onDetails={handleOrderDetailsClick}
                    onCancel={handleOrderCancelClick}
                  />
                )}
              </>
            )}
          </Container>
        </Box>
      </Box>

      {/* REUSABLE PRODUCT MODAL FORM */}
      <ProductForm 
        open={formOpen} 
        product={selectedProduct} 
        onSave={handleSaveProduct} 
        onCancel={() => setFormOpen(false)} 
      />

      {/* REUSABLE CUSTOMER REGISTRATION FORM */}
      <CustomerForm
        open={custFormOpen}
        onSave={handleSaveCustomer}
        onCancel={() => setCustFormOpen(false)}
      />

      {/* REUSABLE ORDER FORM MODAL */}
      <OrderForm
        open={orderFormOpen}
        customers={customers}
        products={products}
        onSave={handleSaveOrder}
        onCancel={() => setOrderFormOpen(false)}
      />

      {/* REUSABLE ORDER DETAILS MODAL */}
      <OrderDetailsModal
        open={orderDetailsOpen}
        order={selectedOrder}
        customer={customers.find(c => c.id === selectedOrder?.customer_id)}
        products={products}
        onClose={() => setOrderDetailsOpen(false)}
      />

      {/* REUSABLE PRODUCT DELETE CONFIRMATION DIALOG */}
      <ConfirmDeleteModal 
        open={deleteOpen} 
        title="Delete Catalog Product" 
        content={`Are you sure you want to delete "${productToDelete?.name}" (SKU: ${productToDelete?.sku}) from the catalog? This is irreversible.`}
        onConfirm={handleConfirmDelete} 
        onCancel={() => setDeleteOpen(false)} 
      />

      {/* REUSABLE CUSTOMER DELETE CONFIRMATION DIALOG */}
      <ConfirmDeleteModal
        open={custDeleteOpen}
        title="Delete Customer Profile"
        content={`Are you sure you want to delete customer "${customerToDelete?.name}" (${customerToDelete?.email})? All associated orders will be deleted under cascade rules.`}
        onConfirm={handleConfirmCustDelete}
        onCancel={() => setCustDeleteOpen(false)}
      />

      {/* REUSABLE ORDER CANCEL CONFIRMATION DIALOG */}
      <ConfirmDeleteModal
        open={orderCancelOpen}
        title="Cancel Active Order"
        content="Are you sure you want to cancel this order? All items will be returned to product stock levels."
        onConfirm={handleConfirmOrderCancel}
        onCancel={() => setOrderCancelOpen(false)}
      />
    </ThemeProvider>
  );
}

export default App;
