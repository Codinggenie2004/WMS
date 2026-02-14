import { useState, useEffect } from 'react';
import { api } from '../utils/api';

export const useWarehouse = () => {
  const [products, setProducts] = useState([]);
  const [slots, setSlots] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchSlots = async () => {
    try {
      const data = await api.getSlots();
      setSlots(data);
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  const fetchAreas = async () => {
    try {
      const data = await api.getAreas();
      setAreas(data);
    } catch (error) {
      console.error('Error fetching areas:', error);
    }
  };

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([fetchProducts(), fetchSlots(), fetchAreas()]);
    setLoading(false);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  return {
    products,
    slots,
    areas,
    loading,
    setLoading,
    fetchProducts,
    fetchSlots,
    fetchAreas,
    refreshAll
  };
};