import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useStoreStore } from '@/store/storeStore';
import { useUIStore } from '@/store/uiStore';

// Layout
import Layout from '@/components/layout/Layout';

// Pages
import Dashboard from '@/pages/Dashboard';
import ProductCatalog from '@/pages/ProductCatalog';
import ProductDetail from '@/pages/ProductDetail';
import OrderList from '@/pages/OrderList';
import OrderDetail from '@/pages/OrderDetail';
import CreateOrder from '@/pages/CreateOrder';
import Inventory from '@/pages/Inventory';
import Login from '@/pages/Login';
import Profile from '@/pages/Profile';

// Toast notifications
import ToastContainer from '@/components/ui/ToastContainer';

function App() {
  const { isAuthenticated } = useAuthStore();
  const { initializeStores } = useStoreStore();
  const { theme } = useUIStore();

  useEffect(() => {
    initializeStores();
    
    // Initialize theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<ProductCatalog />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/orders/new" element={<CreateOrder />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
