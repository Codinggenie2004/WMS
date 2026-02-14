const getBaseUrl = () => {
  const { hostname } = window.location;
  return `http://${hostname}:5000/api`;
};

export const API_URL = getBaseUrl();

export const api = {
  // Auth
  login: async (username, password) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return response;
  },

  // Products
  getProducts: async () => {
    const response = await fetch(`${API_URL}/products`);
    return response.json();
  },

  searchProduct: async (searchData) => {
    const response = await fetch(`${API_URL}/products/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(searchData)
    });
    return response;
  },

  addProduct: async (productData) => {
    const response = await fetch(`${API_URL}/auto-store`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return response;
  },

  addProductCustom: async (productData) => {
    const response = await fetch(`${API_URL}/allocate-custom`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return response;
  },

  deleteProduct: async (productId) => {
    const response = await fetch(`${API_URL}/products/${productId}`, {
      method: 'DELETE'
    });
    return response;
  },

  // Slots
  getSlots: async () => {
    const response = await fetch(`${API_URL}/slots`);
    return response.json();
  },

  createSlot: async (slotData) => {
    const response = await fetch(`${API_URL}/slot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slotData)
    });
    return response;
  },

  createBulkSlots: async (area, count) => {
    const response = await fetch(`${API_URL}/slots/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ area, count })
    });
    return response;
  },

  deleteSlot: async (slotId) => {
    const response = await fetch(`${API_URL}/slots/${slotId}`, {
      method: 'DELETE'
    });
    return response;
  },

  // Areas
  getAreas: async () => {
    const response = await fetch(`${API_URL}/areas`);
    return response.json();
  },

  createArea: async (name) => {
    const response = await fetch(`${API_URL}/area`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    return response;
  },

  deleteArea: async (areaId) => {
    const response = await fetch(`${API_URL}/areas/${areaId}`, {
      method: 'DELETE'
    });
    return response;
  }
};