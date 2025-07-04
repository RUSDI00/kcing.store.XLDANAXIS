import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../services/api';

const AdminContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  padding: 2rem;
`;

const AdminHeader = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
`;

const AdminTitle = styled.h1`
  color: white;
  font-size: 3rem;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-weight: 800;
`;

const AdminSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StatIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  font-weight: 500;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 1rem 2rem;
  background: ${props => props.active 
    ? 'rgba(255, 255, 255, 0.2)' 
    : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;


const ContentContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const SectionTitle = styled.h2`
  color: white;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  th {
    background: rgba(255, 255, 255, 0.1);
    font-weight: 600;
    color: white;
    font-size: 1rem;
  }

  td {
    color: rgba(255, 255, 255, 0.9);
  }

  tr:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  margin-right: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(238, 90, 36, 0.4);
  }

  &.approve {
    background: linear-gradient(135deg, #00b894, #00a085);
    
    &:hover {
      box-shadow: 0 5px 15px rgba(0, 184, 148, 0.4);
    }
  }

  &.edit {
    background: linear-gradient(135deg, #fdcb6e, #e17055);
    
    &:hover {
      box-shadow: 0 5px 15px rgba(253, 203, 110, 0.4);
    }
  }
`;

const Form = styled.form`
  display: grid;
  gap: 1.5rem;
  max-width: 600px;
  margin: 2rem 0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  backdrop-filter: blur(10px);

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const Select = styled.select`
  padding: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  backdrop-filter: blur(10px);

  option {
    background: #2a5298;
    color: white;
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const Label = styled.label`
  color: white;
  font-weight: 600;
  font-size: 1rem;
`;

const SubmitButton = styled.button`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #00b894, #00a085);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 184, 148, 0.3);
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
`;



interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

interface Transaction {
  id: string;
  user_id: string;
  username?: string;
  product_name: string;
  amount: number;
  voucher_code?: string;
  payment_method?: string;
  status: string;
  payment_proof?: string;
  created_at: string;
}

interface Voucher {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase: number;
  max_usage: number;
  current_usage: number;
  expires_at: string;
  is_active: boolean;
}

interface Product {
  id: number;
  title: string;
  data_size: string;
  price: number;
  is_active: boolean;
}

interface Extension {
  id: number;
  phone_number: string;
  expiry_date: string;
  user_name: string;
  amount: number;
  quota_type: 'L' | 'XL' | 'XXL';
  created_at: string;
  updated_at?: string;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Voucher form state
  const [voucherForm, setVoucherForm] = useState({
    code: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: '',
    min_purchase: '',
    max_usage: '',
    expires_at: ''
  });
  
  // Edit voucher state
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Manual transaction form state
  const [manualTransactionForm, setManualTransactionForm] = useState({
    customer_name: '',
    product_name: '',
    amount: '',
    voucher_code: '',
    status: 'confirmed'
  });
  const [showManualForm, setShowManualForm] = useState(false);

  // Extension form state
  const [extensionForm, setExtensionForm] = useState({
    phone_number: '',
    expiry_date: '',
    user_name: '',
    amount: '',
    quota_type: 'L' as 'L' | 'XL' | 'XXL'
  });
  const [showExtensionForm, setShowExtensionForm] = useState(false);
  const [editingExtension, setEditingExtension] = useState<Extension | null>(null);

  // Extension filtering and sorting state
  const [quotaFilter, setQuotaFilter] = useState<'ALL' | 'L' | 'XL' | 'XXL'>('ALL');
  const [sortBy, setSortBy] = useState<'nearest' | 'farthest'>('nearest');

  // Helper functions for payment methods
  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      'qris': 'QRIS',
      'shopeepay': 'ShopeePay',
      'dana': 'DANA',
      'gopay': 'GoPay',
      'seabank': 'SeaBank',
      'bsi': 'BSI'
    };
    return labels[method] || method.toUpperCase();
  };

  const getPaymentMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      'qris': '#1CB0F6',
      'shopeepay': '#FF5722',
      'dana': '#118EEA',
      'gopay': '#00AA13',
      'seabank': '#FF6B35',
      'bsi': '#4CAF50'
    };
    return colors[method] || '#6c757d';
  };

  // Helper functions for extensions
  const getDaysLeft = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysLeftColor = (daysLeft: number) => {
    if (daysLeft < 0) return '#dc3545'; // Expired - Red
    if (daysLeft <= 7) return '#ffc107'; // Expiring soon - Yellow
    return '#28a745'; // Safe - Green
  };

  const handleEditExtension = (extension: Extension) => {
    setEditingExtension(extension);
    setExtensionForm({
      phone_number: extension.phone_number,
      expiry_date: extension.expiry_date,
      user_name: extension.user_name,
      amount: extension.amount.toString(),
      quota_type: extension.quota_type
    });
    setShowExtensionForm(true);
  };

  const downloadExtensionsReport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "No,Phone Number,User Name,Expiry Date,Quota Type,Amount,Days Left\n";
    
    extensions.forEach((extension, index) => {
      const daysLeft = getDaysLeft(extension.expiry_date);
      csvContent += `${index + 1},${extension.phone_number},${extension.user_name},${new Date(extension.expiry_date).toLocaleDateString()},${extension.quota_type},${extension.amount},${daysLeft}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `extensions_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'transactions') {
      fetchTransactions();
      fetchProducts();
    } else if (activeTab === 'vouchers') {
      fetchVouchers();
    } else if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'extensions') {
      fetchExtensions();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/transactions');
      setTransactions(response.data);
    } catch (err) {
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/vouchers');
      setVouchers(response.data);
    } catch (err) {
      setError('Failed to fetch vouchers');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/admin/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  // Extension management functions
  const fetchExtensions = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/extensions');
      setExtensions(response.data);
    } catch (err) {
      setError('Failed to fetch extensions');
    } finally {
      setLoading(false);
    }
  };

  const handleExtensionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const extensionData = {
        phone_number: extensionForm.phone_number,
        expiry_date: extensionForm.expiry_date,
        user_name: extensionForm.user_name,
        amount: parseFloat(extensionForm.amount),
        quota_type: extensionForm.quota_type
      };

      if (editingExtension) {
        await api.put(`/admin/extensions/${editingExtension.id}`, extensionData);
        setSuccess('Extension updated successfully');
      } else {
        await api.post('/admin/extensions', extensionData);
        setSuccess('Extension added successfully');
      }

      // Reset form
      setExtensionForm({
        phone_number: '',
        expiry_date: '',
        user_name: '',
        amount: '',
        quota_type: 'L'
      });
      setShowExtensionForm(false);
      setEditingExtension(null);
      fetchExtensions();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save extension');
    }
  };

  const deleteExtension = async (extensionId: number) => {
    if (!window.confirm('Are you sure you want to delete this extension record?')) return;

    try {
      await api.delete(`/admin/extensions/${extensionId}`);
      setSuccess('Extension deleted successfully');
      fetchExtensions();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete extension');
    }
  };



  // Function to get extensions expiring soon (within 7 days)
  const getExpiringSoon = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return extensions.filter(ext => {
      const expiryDate = new Date(ext.expiry_date);
      return expiryDate >= today && expiryDate <= nextWeek;
    });
  };

  // Function to get expired extensions
  const getExpired = () => {
    const today = new Date();
    return extensions.filter(ext => {
      const expiryDate = new Date(ext.expiry_date);
      return expiryDate < today;
    });
  };

  // Function to filter and sort extensions
  const getFilteredAndSortedExtensions = () => {
    let filteredExtensions = extensions;

    // Filter by quota type
    if (quotaFilter !== 'ALL') {
      filteredExtensions = extensions.filter(ext => ext.quota_type === quotaFilter);
    }

    // Sort by expiry date
    return filteredExtensions.sort((a, b) => {
      const dateA = new Date(a.expiry_date).getTime();
      const dateB = new Date(b.expiry_date).getTime();
      
      if (sortBy === 'nearest') {
        return dateA - dateB; // Ascending (nearest first)
      } else {
        return dateB - dateA; // Descending (farthest first)
      }
    });
  };

  // Function to get extensions count by quota type
  const getExtensionsByQuotaType = () => {
    const counts = { L: 0, XL: 0, XXL: 0 };
    extensions.forEach(ext => {
      counts[ext.quota_type]++;
    });
    return counts;
  };

  const updateTransactionStatus = async (transactionId: string, status: string) => {
    try {
      console.log('Updating transaction:', transactionId, 'to status:', status);
      const response = await api.put(`/admin/transactions/${transactionId}`, { status });
      console.log('Update response:', response.data);
      setSuccess('Transaction status updated successfully');
      fetchTransactions();
    } catch (err: any) {
      console.error('Transaction update error:', err);
      setError(err.response?.data?.error || 'Failed to update transaction status');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await api.delete(`/admin/users/${userId}`);
      setSuccess('User deleted successfully');
      fetchUsers();
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const updateUserStatus = async (userId: string, status: 'active' | 'suspended') => {
    const action = status === 'suspended' ? 'suspend' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
    
    try {
      await api.put(`/admin/users/${userId}/status`, { status });
      setSuccess(`User ${action}d successfully`);
      fetchUsers();
    } catch (err) {
      setError(`Failed to ${action} user`);
    }
  };

  const deleteTransaction = async (transactionId: string) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      await api.delete(`/admin/transactions/${transactionId}`);
      setSuccess('Transaction deleted successfully');
      fetchTransactions();
    } catch (err) {
      setError('Failed to delete transaction');
    }
  };

  const handleManualTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/admin/transactions/manual', {
        customer_name: manualTransactionForm.customer_name,
        product_name: manualTransactionForm.product_name,
        amount: parseFloat(manualTransactionForm.amount),
        voucher_code: manualTransactionForm.voucher_code || null,
        status: manualTransactionForm.status
      });
      
      setSuccess('Manual transaction created successfully');
      setManualTransactionForm({
        customer_name: '',
        product_name: '',
        amount: '',
        voucher_code: '',
        status: 'confirmed'
      });
      setShowManualForm(false);
      fetchTransactions();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create manual transaction');
    }
  };

  const downloadTransactionsReport = () => {
    const confirmedTransactions = transactions.filter(t => t.status === 'confirmed');
    const totalRevenue = confirmedTransactions.reduce((total, t) => total + t.amount, 0);
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "No,Username,Product,Amount,Voucher,Status,Date\n";
    
    confirmedTransactions.forEach((transaction, index) => {
      csvContent += `${index + 1},${transaction.username || 'N/A'},${transaction.product_name},${transaction.amount},${transaction.voucher_code || '-'},${transaction.status},${new Date(transaction.created_at).toLocaleDateString()}\n`;
    });
    
    csvContent += `\n,,,Total Revenue:,Rp ${totalRevenue.toLocaleString()},,\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `transactions_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleVoucherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isEditing) {
      await updateVoucher(e);
    } else {
      try {
        await api.post('/admin/vouchers', {
          ...voucherForm,
          discount_value: parseFloat(voucherForm.discount_value),
          min_purchase: parseFloat(voucherForm.min_purchase) || 0,
          max_usage: parseInt(voucherForm.max_usage),
          expires_at: new Date(voucherForm.expires_at).toISOString()
        });
        
        setSuccess('Voucher created successfully');
        setVoucherForm({
          code: '',
          discount_type: 'percentage',
          discount_value: '',
          min_purchase: '',
          max_usage: '',
          expires_at: ''
        });
        fetchVouchers();
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to create voucher');
      }
    }
  };

  const toggleVoucherStatus = async (voucherId: string, isActive: boolean) => {
    try {
      await api.put(`/admin/vouchers/${voucherId}`, { 
        is_active: !isActive 
      });
      setSuccess(`Voucher ${!isActive ? 'activated' : 'deactivated'} successfully`);
      fetchVouchers();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update voucher status');
    }
  };

  const deleteVoucher = async (voucherId: string) => {
    if (!window.confirm('Are you sure you want to delete this voucher?')) return;
    
    try {
      await api.delete(`/admin/vouchers/${voucherId}`);
      setSuccess('Voucher deleted successfully');
      fetchVouchers();
    } catch (err) {
      setError('Failed to delete voucher');
    }
  };

  const startEditVoucher = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setIsEditing(true);
    setVoucherForm({
      code: voucher.code,
      discount_type: voucher.discount_type,
      discount_value: voucher.discount_value.toString(),
      min_purchase: voucher.min_purchase.toString(),
      max_usage: voucher.max_usage.toString(),
      expires_at: voucher.expires_at ? new Date(voucher.expires_at).toISOString().slice(0, 16) : ''
    });
  };

  const cancelEditVoucher = () => {
    setEditingVoucher(null);
    setIsEditing(false);
    setVoucherForm({
      code: '',
      discount_type: 'percentage',
      discount_value: '',
      min_purchase: '',
      max_usage: '',
      expires_at: ''
    });
  };

  const updateVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVoucher) return;

    try {
      const voucherData = {
        code: voucherForm.code,
        discount_type: voucherForm.discount_type,
        discount_value: parseFloat(voucherForm.discount_value),
        min_purchase: parseFloat(voucherForm.min_purchase) || 0,
        max_usage: parseInt(voucherForm.max_usage),
        expires_at: new Date(voucherForm.expires_at).toISOString()
      };

      await api.put(`/admin/vouchers/${editingVoucher.id}`, voucherData);
      setSuccess('Voucher updated successfully');
      cancelEditVoucher();
      fetchVouchers();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update voucher');
    }
  };

  const renderUsersTab = () => (
    <div>
      <SectionTitle>👥 Users Management</SectionTitle>
      {loading && <LoadingMessage>Loading users...</LoadingMessage>}
      {!loading && users.length === 0 && <p style={{color: 'white'}}>No users found.</p>}
      {!loading && users.length > 0 && (
        <Table>
          <thead>
            <tr>
              <th>👤 Username</th>
              <th>📧 Email</th>
              <th>🔰 Role</th>
              <th>� Status</th>
              <th>�📅 Created</th>
              <th>⚡ Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span style={{ 
                    color: user.status === 'active' ? '#4CAF50' : '#f44336',
                    fontWeight: 'bold'
                  }}>
                    {user.status || 'active'}
                  </span>
                </td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  {user.role !== 'admin' && (
                    <>
                      <ActionButton 
                        onClick={() => updateUserStatus(user.id, user.status === 'active' ? 'suspended' : 'active')}
                        style={{ 
                          marginRight: '0.5rem',
                          background: user.status === 'active' ? '#ff9800' : '#4CAF50'
                        }}
                      >
                        {user.status === 'active' ? '⏸️ Suspend' : '▶️ Activate'}
                      </ActionButton>
                      <ActionButton 
                        onClick={() => deleteUser(user.id)}
                        style={{ background: '#f44336' }}
                      >
                        🗑️ Delete
                      </ActionButton>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );

  const renderTransactionsTab = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <SectionTitle>💳 Transactions Management</SectionTitle>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <ActionButton 
            className="approve"
            onClick={() => setShowManualForm(!showManualForm)}
          >
            {showManualForm ? 'Cancel' : '➕ Add Manual Transaction'}
          </ActionButton>
          <ActionButton 
            className="edit"
            onClick={downloadTransactionsReport}
          >
            📥 Download Report
          </ActionButton>
        </div>
      </div>

      {/* Total Revenue Display */}
      <div style={{ 
        background: 'rgba(0, 184, 148, 0.1)', 
        border: '1px solid rgba(0, 184, 148, 0.3)',
        borderRadius: '12px',
        padding: '1rem',
        marginBottom: '1.5rem',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#00b894', margin: '0 0 0.5rem 0' }}>💰 Total Revenue (Confirmed)</h3>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>
          Rp {transactions
            .filter(t => t.status === 'confirmed')
            .reduce((total, t) => total + t.amount, 0)
            .toLocaleString()}
        </div>
      </div>

      {/* Manual Transaction Form */}
      {showManualForm && (
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          borderRadius: '12px', 
          padding: '1.5rem', 
          marginBottom: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>Add Manual Transaction</h3>
          <Form onSubmit={handleManualTransactionSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <FormGroup>
                <Label>Customer Name</Label>
                <Input
                  type="text"
                  placeholder="Enter customer name"
                  value={manualTransactionForm.customer_name}
                  onChange={(e) => setManualTransactionForm({...manualTransactionForm, customer_name: e.target.value})}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Product Name</Label>
                <Select
                  value={manualTransactionForm.product_name}
                  onChange={(e) => {
                    const selectedProduct = products.find(p => p.title === e.target.value);
                    setManualTransactionForm({
                      ...manualTransactionForm, 
                      product_name: e.target.value,
                      amount: selectedProduct ? selectedProduct.price.toString() : manualTransactionForm.amount
                    });
                  }}
                  required
                >
                  <option value="">Select a product</option>
                  {products.map(product => (
                    <option key={product.id} value={product.title}>
                      {product.title} - Rp {product.price.toLocaleString()}
                    </option>
                  ))}
                  <option value="Custom">Custom Product</option>
                </Select>
              </FormGroup>
              {manualTransactionForm.product_name === 'Custom' && (
                <FormGroup>
                  <Label>Custom Product Name</Label>
                  <Input
                    type="text"
                    placeholder="Enter custom product name"
                    onChange={(e) => setManualTransactionForm({...manualTransactionForm, product_name: e.target.value})}
                    required
                  />
                </FormGroup>
              )}
              <FormGroup>
                <Label>Amount (Rp)</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={manualTransactionForm.amount}
                  onChange={(e) => setManualTransactionForm({...manualTransactionForm, amount: e.target.value})}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Voucher Code (Optional)</Label>
                <Input
                  type="text"
                  placeholder="Enter voucher code"
                  value={manualTransactionForm.voucher_code}
                  onChange={(e) => setManualTransactionForm({...manualTransactionForm, voucher_code: e.target.value})}
                />
              </FormGroup>
              <FormGroup>
                <Label>Status</Label>
                <Select
                  value={manualTransactionForm.status}
                  onChange={(e) => setManualTransactionForm({...manualTransactionForm, status: e.target.value})}
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="rejected">Rejected</option>
                </Select>
              </FormGroup>
            </div>
            <SubmitButton type="submit" style={{ marginTop: '1rem' }}>
              ➕ Create Transaction
            </SubmitButton>
          </Form>
        </div>
      )}

      {loading && <LoadingMessage>Loading transactions...</LoadingMessage>}
      {!loading && transactions.length === 0 && <p style={{color: 'white'}}>No transactions found.</p>}
      {!loading && transactions.length > 0 && (
        <Table>
          <thead>
            <tr>
              <th>👤 Username</th>
              <th>📦 Product</th>
              <th>💰 Amount</th>
              <th>🎟️ Voucher</th>
              <th>� Payment Method</th>
              <th>�📊 Status</th>
              <th>📸 Proof</th>
              <th>📅 Date</th>
              <th>⚡ Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.username || 'Unknown User'}</td>
                <td>{transaction.product_name}</td>
                <td>Rp {transaction.amount.toLocaleString()}</td>
                <td>{transaction.voucher_code || '-'}</td>
                <td>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    background: getPaymentMethodColor(transaction.payment_method || 'qris'),
                    color: 'white'
                  }}>
                    {getPaymentMethodLabel(transaction.payment_method || 'qris')}
                  </span>
                </td>
                <td>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    background: transaction.status === 'confirmed' ? '#00b894' : 
                               transaction.status === 'pending' ? '#fdcb6e' : 
                               transaction.status === 'cancelled' ? '#fd79a8' : '#ff6b6b',
                    color: 'white'
                  }}>
                    {transaction.status}
                  </span>
                </td>
                <td>
                  {transaction.payment_proof ? (
                    <a 
                      href={`http://localhost:5000${transaction.payment_proof}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#00b894', textDecoration: 'none' }}
                    >
                      📸 View
                    </a>
                  ) : '-'}
                </td>
                <td>{new Date(transaction.created_at).toLocaleDateString()}</td>
                <td>
                  {transaction.status === 'pending' && (
                    <>
                      <ActionButton 
                        className="approve"
                        onClick={() => updateTransactionStatus(transaction.id, 'confirmed')}
                      >
                        ✅ Confirm
                      </ActionButton>
                      <ActionButton 
                        onClick={() => updateTransactionStatus(transaction.id, 'rejected')}
                      >
                        ❌ Reject
                      </ActionButton>
                    </>
                  )}
                  {transaction.status === 'confirmed' && (
                    <ActionButton 
                      onClick={() => updateTransactionStatus(transaction.id, 'cancelled')}
                      style={{ background: '#fd79a8' }}
                    >
                      🚫 Cancel
                    </ActionButton>
                  )}
                  <ActionButton 
                    onClick={() => deleteTransaction(transaction.id)}
                    style={{ background: '#ff6b6b' }}
                  >
                    �️ Delete
                  </ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );

  const renderVouchersTab = () => (
    <div>
      <SectionTitle>🎟️ Vouchers Management</SectionTitle>
      
      <Form onSubmit={handleVoucherSubmit}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ color: 'white', fontSize: '1.5rem', margin: 0 }}>
            {isEditing ? 'Edit Voucher' : 'Create New Voucher'}
          </h3>
          {isEditing && (
            <ActionButton onClick={cancelEditVoucher} style={{ background: '#6c757d' }}>
              Cancel Edit
            </ActionButton>
          )}
        </div>
        <FormGroup>
          <Label>Voucher Code</Label>
          <Input
            type="text"
            placeholder="Enter voucher code (e.g., SAVE20)"
            value={voucherForm.code}
            onChange={(e) => setVoucherForm({...voucherForm, code: e.target.value})}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Discount Type</Label>
          <Select
            value={voucherForm.discount_type}
            onChange={(e) => setVoucherForm({...voucherForm, discount_type: e.target.value as 'percentage' | 'fixed'})}
          >
            <option value="percentage">Percentage Discount</option>
            <option value="fixed">Fixed Amount Discount</option>
          </Select>
        </FormGroup>
        <FormGroup>
          <Label>Discount Value</Label>
          <Input
            type="number"
            placeholder="Enter discount value"
            value={voucherForm.discount_value}
            onChange={(e) => setVoucherForm({...voucherForm, discount_value: e.target.value})}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Minimum Purchase (Optional)</Label>
          <Input
            type="number"
            placeholder="Minimum purchase amount"
            value={voucherForm.min_purchase}
            onChange={(e) => setVoucherForm({...voucherForm, min_purchase: e.target.value})}
          />
        </FormGroup>
        <FormGroup>
          <Label>Maximum Usage</Label>
          <Input
            type="number"
            placeholder="How many times can be used"
            value={voucherForm.max_usage}
            onChange={(e) => setVoucherForm({...voucherForm, max_usage: e.target.value})}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Expiry Date</Label>
          <Input
            type="datetime-local"
            value={voucherForm.expires_at}
            onChange={(e) => setVoucherForm({...voucherForm, expires_at: e.target.value})}
            required
          />
        </FormGroup>
        <SubmitButton type="submit">
          {isEditing ? '✏️ Update Voucher' : '🎉 Create Voucher'}
        </SubmitButton>
      </Form>

      {loading && <LoadingMessage>Loading vouchers...</LoadingMessage>}
      {!loading && vouchers.length === 0 && <p>No vouchers found.</p>}
      {!loading && vouchers.length > 0 && (
        <Table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Value</th>
              <th>Min Purchase</th>
              <th>Usage</th>
              <th>Expires</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map(voucher => (
              <tr key={voucher.id}>
                <td>{voucher.code}</td>
                <td>{voucher.discount_type}</td>
                <td>
                  {voucher.discount_type === 'percentage' 
                    ? `${voucher.discount_value}%` 
                    : `Rp ${voucher.discount_value.toLocaleString()}`
                  }
                </td>
                <td>Rp {voucher.min_purchase.toLocaleString()}</td>
                <td>{voucher.current_usage}/{voucher.max_usage}</td>
                <td>{new Date(voucher.expires_at).toLocaleDateString()}</td>
                <td>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    background: voucher.is_active ? '#00b894' : '#fd79a8',
                    color: 'white'
                  }}>
                    {voucher.is_active ? '✅ Active' : '❌ Inactive'}
                  </span>
                </td>
                <td>
                  <ActionButton 
                    className="edit"
                    onClick={() => startEditVoucher(voucher)}
                  >
                    ✏️ Edit
                  </ActionButton>
                  <ActionButton 
                    className="edit"
                    onClick={() => toggleVoucherStatus(voucher.id, voucher.is_active)}
                    style={{ 
                      background: voucher.is_active 
                        ? 'linear-gradient(135deg, #fd79a8, #fdcb6e)' 
                        : 'linear-gradient(135deg, #00b894, #00a085)'
                    }}
                  >
                    {voucher.is_active ? '⏸️ Deactivate' : '▶️ Activate'}
                  </ActionButton>
                  <ActionButton 
                    onClick={() => deleteVoucher(voucher.id)}
                  >
                    Delete
                  </ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );

  const renderProductsTab = () => (
    <div>
      <SectionTitle>📦 Products Management</SectionTitle>
      {loading && <LoadingMessage>Loading products...</LoadingMessage>}
      {!loading && products.length === 0 && <p style={{color: 'white'}}>No products found.</p>}
      {!loading && products.length > 0 && (
        <Table>
          <thead>
            <tr>
              <th>📦 Product</th>
              <th>📊 Data Size</th>
              <th>💰 Price</th>
              <th>🔄 Status</th>
              <th>⚡ Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <ProductRowComponent key={product.id} product={product} onUpdate={fetchProducts} />
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );

  const ProductRowComponent = ({ product, onUpdate }: { product: any, onUpdate: () => void }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
      title: product.title,
      data_size: product.data_size,
      price: product.price,
      is_active: product.is_active
    });

    const handleSave = async () => {
      try {
        await api.put(`/admin/products/${product.id}`, editForm);
        setSuccess('Product updated successfully');
        setIsEditing(false);
        onUpdate();
      } catch (err) {
        setError('Failed to update product');
      }
    };

    if (isEditing) {
      return (
        <tr>
          <td>
            <input 
              value={editForm.title} 
              onChange={(e) => setEditForm({...editForm, title: e.target.value})}
              style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '0.5rem', borderRadius: '4px' }}
            />
          </td>
          <td>
            <input 
              value={editForm.data_size} 
              onChange={(e) => setEditForm({...editForm, data_size: e.target.value})}
              style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '0.5rem', borderRadius: '4px' }}
            />
          </td>
          <td>
            <input 
              type="number"
              value={editForm.price} 
              onChange={(e) => setEditForm({...editForm, price: parseInt(e.target.value)})}
              style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '0.5rem', borderRadius: '4px' }}
            />
          </td>
          <td>
            <select 
              value={editForm.is_active ? 'active' : 'inactive'} 
              onChange={(e) => setEditForm({...editForm, is_active: e.target.value === 'active'})}
              style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '0.5rem', borderRadius: '4px' }}
            >
              <option value="active" style={{ background: '#1a1a2e' }}>Active</option>
              <option value="inactive" style={{ background: '#1a1a2e' }}>Inactive</option>
            </select>
          </td>
          <td>
            <ActionButton onClick={handleSave} style={{ marginRight: '0.5rem', background: '#4CAF50' }}>
              💾 Save
            </ActionButton>
            <ActionButton onClick={() => setIsEditing(false)} style={{ background: '#f44336' }}>
              ❌ Cancel
            </ActionButton>
          </td>
        </tr>
      );
    }

    return (
      <tr>
        <td>{product.title}</td>
        <td>{product.data_size}</td>
        <td>Rp {product.price?.toLocaleString()}</td>
        <td>
          <span style={{ 
            color: product.is_active ? '#4CAF50' : '#f44336',
            fontWeight: 'bold'
          }}>
            {product.is_active ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td>
          <ActionButton 
            onClick={() => setIsEditing(true)}
            style={{ background: '#2196F3' }}
          >
            ✏️ Edit
          </ActionButton>
        </td>
      </tr>
    );
  };

  const renderExtensionsTab = () => {
    const quotaCounts = getExtensionsByQuotaType();
    
    return (
    <div>
      <SectionTitle>📅 Perpanjangan - Extension Management</SectionTitle>
      
      {/* Extension Statistics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{ 
          background: 'rgba(0, 184, 148, 0.1)', 
          border: '1px solid rgba(0, 184, 148, 0.3)',
          borderRadius: '12px',
          padding: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ color: '#00b894', fontSize: '2rem', fontWeight: 'bold' }}>
            {extensions.length}
          </div>
          <div style={{ color: 'white', fontSize: '0.9rem' }}>Total Extensions</div>
        </div>
        
        <div style={{ 
          background: 'rgba(255, 193, 7, 0.1)', 
          border: '1px solid rgba(255, 193, 7, 0.3)',
          borderRadius: '12px',
          padding: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ color: '#ffc107', fontSize: '2rem', fontWeight: 'bold' }}>
            {getExpiringSoon().length}
          </div>
          <div style={{ color: 'white', fontSize: '0.9rem' }}>Expiring Soon (7 days)</div>
        </div>
        
        <div style={{ 
          background: 'rgba(220, 53, 69, 0.1)', 
          border: '1px solid rgba(220, 53, 69, 0.3)',
          borderRadius: '12px',
          padding: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ color: '#dc3545', fontSize: '2rem', fontWeight: 'bold' }}>
            {getExpired().length}
          </div>
          <div style={{ color: 'white', fontSize: '0.9rem' }}>Expired</div>
        </div>
        
        <div style={{ 
          background: 'rgba(111, 66, 193, 0.1)', 
          border: '1px solid rgba(111, 66, 193, 0.3)',
          borderRadius: '12px',
          padding: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ color: '#6f42c1', fontSize: '2rem', fontWeight: 'bold' }}>
            Rp {extensions.reduce((total, ext) => total + ext.amount, 0).toLocaleString()}
          </div>
          <div style={{ color: 'white', fontSize: '0.9rem' }}>Total Amount</div>
        </div>
      </div>

      {/* Quota Type Statistics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{ 
          background: 'rgba(23, 162, 184, 0.1)', 
          border: '1px solid rgba(23, 162, 184, 0.3)',
          borderRadius: '12px',
          padding: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ color: '#17a2b8', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {quotaCounts.L}
          </div>
          <div style={{ color: 'white', fontSize: '0.9rem' }}>Quota L</div>
        </div>
        
        <div style={{ 
          background: 'rgba(40, 167, 69, 0.1)', 
          border: '1px solid rgba(40, 167, 69, 0.3)',
          borderRadius: '12px',
          padding: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ color: '#28a745', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {quotaCounts.XL}
          </div>
          <div style={{ color: 'white', fontSize: '0.9rem' }}>Quota XL</div>
        </div>
        
        <div style={{ 
          background: 'rgba(111, 66, 193, 0.1)', 
          border: '1px solid rgba(111, 66, 193, 0.3)',
          borderRadius: '12px',
          padding: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ color: '#6f42c1', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {quotaCounts.XXL}
          </div>
          <div style={{ color: 'white', fontSize: '0.9rem' }}>Quota XXL</div>
        </div>
      </div>

      {/* Filter and Sort Controls */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <ActionButton 
          className="approve"
          onClick={() => {
            setShowExtensionForm(!showExtensionForm);
            if (showExtensionForm) {
              setEditingExtension(null);
              setExtensionForm({
                phone_number: '',
                expiry_date: '',
                user_name: '',
                amount: '',
                quota_type: 'L'
              });
            }
          }}
        >
          {showExtensionForm ? 'Cancel' : '➕ Add Extension'}
        </ActionButton>
        
        <ActionButton 
          className="edit"
          onClick={downloadExtensionsReport}
        >
          📥 Download Report
        </ActionButton>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ color: 'white', fontSize: '0.9rem' }}>Filter:</span>
          <select 
            style={{ 
              padding: '0.5rem', 
              borderRadius: '8px',
              border: 'none',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '0.85rem'
            }}
            value={quotaFilter}
            onChange={(e) => setQuotaFilter(e.target.value as 'ALL' | 'L' | 'XL' | 'XXL')}
          >
            <option value="ALL" style={{ background: '#1a1a2e', color: 'white' }}>All Quotas</option>
            <option value="L" style={{ background: '#1a1a2e', color: 'white' }}>Quota L</option>
            <option value="XL" style={{ background: '#1a1a2e', color: 'white' }}>Quota XL</option>
            <option value="XXL" style={{ background: '#1a1a2e', color: 'white' }}>Quota XXL</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ color: 'white', fontSize: '0.9rem' }}>Sort:</span>
          <select 
            style={{ 
              padding: '0.5rem', 
              borderRadius: '8px',
              border: 'none',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '0.85rem'
            }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'nearest' | 'farthest')}
          >
            <option value="nearest" style={{ background: '#1a1a2e', color: 'white' }}>Nearest Expiry</option>
            <option value="farthest" style={{ background: '#1a1a2e', color: 'white' }}>Farthest Expiry</option>
          </select>
        </div>
      </div>

      {/* Extension Form */}
      {showExtensionForm && (
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          borderRadius: '12px', 
          padding: '1.5rem', 
          marginBottom: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>
            {editingExtension ? 'Edit Extension' : 'Add New Extension'}
          </h3>
          <Form onSubmit={handleExtensionSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <FormGroup>
                <Label>Phone Number</Label>
                <Input
                  type="text"
                  placeholder="Enter phone number"
                  value={extensionForm.phone_number}
                  onChange={(e) => setExtensionForm({...extensionForm, phone_number: e.target.value})}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>User Name</Label>
                <Input
                  type="text"
                  placeholder="Enter user name"
                  value={extensionForm.user_name}
                  onChange={(e) => setExtensionForm({...extensionForm, user_name: e.target.value})}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Expiry Date</Label>
                <Input
                  type="date"
                  value={extensionForm.expiry_date}
                  onChange={(e) => setExtensionForm({...extensionForm, expiry_date: e.target.value})}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Amount (Rp)</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={extensionForm.amount}
                  onChange={(e) => setExtensionForm({...extensionForm, amount: e.target.value})}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Quota Type</Label>
                <Select
                  value={extensionForm.quota_type}
                  onChange={(e) => setExtensionForm({...extensionForm, quota_type: e.target.value as 'L' | 'XL' | 'XXL'})}
                  required
                >
                  <option value="L">Quota L</option>
                  <option value="XL">Quota XL</option>
                  <option value="XXL">Quota XXL</option>
                </Select>
              </FormGroup>
            </div>
            <SubmitButton type="submit" style={{ marginTop: '1rem' }}>
              {editingExtension ? '✏️ Update Extension' : '➕ Create Extension'}
            </SubmitButton>
          </Form>
        </div>
      )}

      {loading && <LoadingMessage>Loading extensions...</LoadingMessage>}
      {!loading && getFilteredAndSortedExtensions().length === 0 && (
        <p style={{color: 'white'}}>No extensions found.</p>
      )}
      {!loading && getFilteredAndSortedExtensions().length > 0 && (
        <Table>
          <thead>
            <tr>
              <th>📱 Phone Number</th>
              <th>👤 User Name</th>
              <th>📅 Expiry Date</th>
              <th>📊 Quota Type</th>
              <th>💰 Amount</th>
              <th>📅 Days Left</th>
              <th>⚡ Actions</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredAndSortedExtensions().map(extension => (
              <tr key={extension.id}>
                <td>{extension.phone_number}</td>
                <td>{extension.user_name}</td>
                <td>{new Date(extension.expiry_date).toLocaleDateString()}</td>
                <td>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    background: extension.quota_type === 'L' ? '#00b894' : 
                               extension.quota_type === 'XL' ? '#0984e3' : '#6c5ce7',
                    color: 'white'
                  }}>
                    Quota {extension.quota_type}
                  </span>
                </td>
                <td>Rp {extension.amount.toLocaleString()}</td>
                <td>
                  <span style={{
                    color: getDaysLeftColor(getDaysLeft(extension.expiry_date)),
                    fontWeight: 'bold'
                  }}>
                    {getDaysLeft(extension.expiry_date)} days
                  </span>
                </td>
                <td>
                  <ActionButton 
                    className="edit"
                    onClick={() => handleEditExtension(extension)}
                    style={{ marginRight: '0.5rem' }}
                  >
                    ✏️ Edit
                  </ActionButton>
                  <ActionButton 
                    onClick={() => deleteExtension(extension.id)}
                    style={{ background: '#ff6b6b' }}
                  >
                    🗑️ Delete
                  </ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
  };

  return (
    <AdminContainer>
      <AdminHeader>
        <AdminTitle>Admin Dashboard</AdminTitle>
        <AdminSubtitle>kcing.store Management Panel</AdminSubtitle>
      </AdminHeader>

      {error && (
        <div style={{ 
          background: '#fee', 
          color: '#c53030', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1rem' 
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ 
          background: '#f0fff4', 
          color: '#38a169', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1rem' 
        }}>
          {success}
        </div>
      )}

      <StatsGrid>
        <StatCard>
          <StatIcon>👥</StatIcon>
          <StatValue>{users.length}</StatValue>
          <StatLabel>Total Users</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon>💳</StatIcon>
          <StatValue>{transactions.length}</StatValue>
          <StatLabel>Total Transactions</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon>🎟️</StatIcon>
          <StatValue>{vouchers.length}</StatValue>
          <StatLabel>Active Vouchers</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon>📦</StatIcon>
          <StatValue>{products.length}</StatValue>
          <StatLabel>Total Products</StatLabel>
        </StatCard>
      </StatsGrid>

      <TabContainer>
        <Tab active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
          👥 Users
        </Tab>
        <Tab active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')}>
          💳 Transactions
        </Tab>
        <Tab active={activeTab === 'vouchers'} onClick={() => setActiveTab('vouchers')}>
          🎟️ Vouchers
        </Tab>
        <Tab active={activeTab === 'products'} onClick={() => setActiveTab('products')}>
          📦 Products
        </Tab>
        <Tab active={activeTab === 'extensions'} onClick={() => setActiveTab('extensions')}>
          📱 Extensions
        </Tab>
      </TabContainer>

      <ContentContainer>
        {activeTab === 'users' && renderUsersTab()}
        {activeTab === 'transactions' && renderTransactionsTab()}
        {activeTab === 'vouchers' && renderVouchersTab()}
        {activeTab === 'products' && renderProductsTab()}
        {activeTab === 'extensions' && renderExtensionsTab()}
      </ContentContainer>
    </AdminContainer>
  );
};

export default AdminDashboard;
