import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  register: (userData: {
    username: string;
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    address?: string;
  }) => api.post('/auth/register', userData),
  
  getCurrentUser: () => api.get('/auth/me'),
};

// User API
export const userAPI = {
  updateProfile: (profileData: {
    username: string;
    email: string;
    full_name: string;
    phone: string;
    address: string;
    currentPassword?: string;
    newPassword?: string;
  }) => api.put('/users/profile', profileData),
  
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/user/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  getTransactions: () => api.get('/transactions'),
};

// Voucher API
export const voucherAPI = {
  getActiveVouchers: () => api.get('/vouchers'),
  
  validateVoucher: (code: string, amount: number) =>
    api.post('/vouchers/validate', { code, amount }),
};

// Product API
export const productAPI = {
  getProducts: () => api.get('/products'),
};

// Transaction API
export const transactionAPI = {
  create: (transactionData: {
    product_id: number;
    product_title: string;
    product_data_size: string;
    original_price: number;
    voucher_code?: string;
    discount_amount?: number;
    final_price: number;
    phone_number: string;
    qris_data?: string;
  }) => api.post('/transactions', transactionData),
  
  uploadPaymentProof: (transactionId: number, file: File) => {
    const formData = new FormData();
    formData.append('payment_proof', file);
    return api.post(`/transactions/${transactionId}/payment-proof`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  confirmPayment: (transactionId: number) =>
    api.put(`/transactions/${transactionId}/confirm-payment`),
  
  confirmWhatsapp: (transactionId: number) =>
    api.put(`/transactions/${transactionId}/confirm-whatsapp`),
};

// Admin API
export const adminAPI = {
  // Users
  getUsers: () => api.get('/admin/users'),
  deleteUser: (userId: number) => api.delete(`/admin/users/${userId}`),
  updateUserStatus: (userId: number, status: 'active' | 'suspended') =>
    api.put(`/admin/users/${userId}/status`, { status }),
  
  // Products
  getProducts: () => api.get('/admin/products'),
  updateProduct: (productId: number, data: {
    title: string;
    data_size: string;
    price: number;
    is_active: boolean;
  }) => api.put(`/admin/products/${productId}`, data),
  
  // Transactions
  getTransactions: () => api.get('/admin/transactions'),
  updateTransaction: (transactionId: number, data: {
    status: string;
    admin_notes?: string;
  }) => api.put(`/admin/transactions/${transactionId}`, data),
  
  // Vouchers
  getVouchers: () => api.get('/admin/vouchers'),
  createVoucher: (voucherData: {
    code: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    min_purchase?: number;
    max_discount?: number;
    usage_limit?: number;
    valid_until?: string;
  }) => api.post('/admin/vouchers', voucherData),
  updateVoucher: (voucherId: number, voucherData: any) =>
    api.put(`/admin/vouchers/${voucherId}`, voucherData),
  deleteVoucher: (voucherId: number) => api.delete(`/admin/vouchers/${voucherId}`),
};

export default api;
