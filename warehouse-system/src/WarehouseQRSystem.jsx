import React, { useState } from 'react';
import { Package, Grid3x3, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useWarehouse } from './hooks/useWarehouse';
import LoginForm from './components/auth/LoginForm';
import Header from './components/common/Header';
import StatsCard from './components/common/StatsCard';
import TabButton from './components/common/TabButton';
import ProductForm from './components/products/ProductForm';
import ProductList from './components/products/ProductList';
import WarehouseView from './components/warehouse/WarehouseView';
import ManageSlotsAreas from './components/management/ManageSlotsAreas';
import ScannerTab from './components/products/ScannerTab';

const WarehouseQRSystem = () => {
  const { currentUser, loginError, loading: authLoading, login, logout } = useAuth();
  const {
    products,
    slots,
    areas,
    loading: warehouseLoading,
    setLoading,
    refreshAll
  } = useWarehouse();

  const [activeTab, setActiveTab] = useState('add');

  const loading = authLoading || warehouseLoading;

  // Login Screen
  if (!currentUser) {
    return (
      <LoginForm
        onLogin={login}
        loginError={loginError}
        loading={authLoading}
      />
    );
  }

  // Main Application
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <Header
          currentUser={currentUser}
          onLogout={logout}
          onRefresh={refreshAll}
          loading={loading}
        />

        {/* Stats Cards - Admin Only */}
        {currentUser.role === 'admin' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <StatsCard
              label="Total Products"
              value={products.length}
              icon={Package}
              color="text-blue-400"
            />
            <StatsCard
              label="Total Slots"
              value={slots.length}
              icon={Grid3x3}
              color="text-purple-400"
            />
            <StatsCard
              label="Occupied"
              value={slots.filter(s => !s.isEmpty).length}
              icon={CheckCircle}
              color="text-green-400"
            />
            <StatsCard
              label="Available"
              value={slots.filter(s => s.isEmpty).length}
              icon={XCircle}
              color="text-orange-400"
            />
          </div>
        )}

        {/* Tabs - Updated with Scanner tab */}
        <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <TabButton active={activeTab === 'add'} onClick={() => setActiveTab('add')}>
            Add
          </TabButton>
          <TabButton active={activeTab === 'scanner'} onClick={() => setActiveTab('scanner')}>
            Scan QR
          </TabButton>
          <TabButton
            active={activeTab === 'warehouse'}
            onClick={() => setActiveTab('warehouse')}
          >
            Warehouse
          </TabButton>
          {currentUser.role === 'admin' && (
            <TabButton
              active={activeTab === 'manage'}
              onClick={() => setActiveTab('manage')}
            >
              Manage
            </TabButton>
          )}
          <TabButton active={activeTab === 'products'} onClick={() => setActiveTab('products')}>
            Products
          </TabButton>
        </div>

        {/* Tab Content */}
        {activeTab === 'add' && (
          <ProductForm
            currentUser={currentUser}
            onProductAdded={refreshAll}
            loading={loading}
            setLoading={setLoading}
          />
        )}

        {activeTab === 'scanner' && (
          <ScannerTab
            products={products}
            currentUser={currentUser}
            loading={loading}
            setLoading={setLoading}
          />
        )}

        {activeTab === 'warehouse' && (
          <WarehouseView slots={slots} products={products} />
        )}

        {activeTab === 'manage' && currentUser.role === 'admin' && (
          <ManageSlotsAreas
            slots={slots}
            onRefresh={refreshAll}
            loading={loading}
            setLoading={setLoading}
          />
        )}

        {activeTab === 'products' && (
          <ProductList
            products={products}
            currentUser={currentUser}
            onRefresh={refreshAll}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </div>
    </div>
  );
};

export default WarehouseQRSystem;