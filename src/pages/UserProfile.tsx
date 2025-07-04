import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: grid;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e0e0e0;
`;

const AvatarPlaceholder = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 2rem;
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  padding: 0.5rem 1rem;
  background: #6c757d;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s ease;

  &:hover {
    background: #5a6268;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }

  th {
    background: #f8f9fa;
    font-weight: 600;
    color: #333;
  }

  tr:hover {
    background: #f8f9fa;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  background: #f8d7da;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
`;

const SuccessMessage = styled.div`
  color: #155724;
  background: #d4edda;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e0e0e0;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 1rem 2rem;
  background: ${props => props.active ? '#007bff' : 'transparent'};
  color: ${props => props.active ? 'white' : '#333'};
  border: none;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? '#0056b3' : '#f8f9fa'};
  }
`;

interface Transaction {
  id: string;
  product_title: string;
  final_price: number;
  original_price: number;
  discount_amount: number;
  voucher_code?: string;
  status: string;
  payment_proof?: string;
  phone_number: string;
  created_at: string;
}

const UserProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (activeTab === 'transactions') {
      fetchTransactions();
    }
  }, [activeTab]);

  useEffect(() => {
    if (user) {
      setProfileForm(prev => ({
        ...prev,
        username: user.username,
        email: user.email,
        full_name: user.full_name || '',
        phone: user.phone || '',
        address: user.address || ''
      }));
    }
  }, [user]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await api.get('/transactions');
      console.log('Transactions response:', response.data);
      // Make sure we're working with array data
      const transactionData = Array.isArray(response.data) ? response.data : [];
      setTransactions(transactionData);
    } catch (err: any) {
      console.error('Failed to fetch transactions:', err);
      setError(err.response?.data?.error || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (profileForm.newPassword && !profileForm.currentPassword) {
      setError('Current password is required to change password');
      return;
    }

    setLoading(true);
    try {
      const updateData: any = {
        username: profileForm.username,
        email: profileForm.email,
        full_name: profileForm.full_name,
        phone: profileForm.phone,
        address: profileForm.address
      };

      if (profileForm.newPassword) {
        updateData.currentPassword = profileForm.currentPassword;
        updateData.newPassword = profileForm.newPassword;
      }

      const response = await api.put('/users/profile', updateData);
      updateUser(response.data.user);
      setSuccess('Profile updated successfully');
      
      // Clear password fields
      setProfileForm(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!avatarFile) return;

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const response = await api.post('/user/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Update the user context with the new avatar
      if (user) {
        updateUser({ ...user, avatar: response.data.avatar });
      }
      setSuccess('Avatar updated successfully');
      setAvatarFile(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update avatar');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const renderProfileTab = () => (
    <div>
      <h2>Profile Information</h2>
      
      <Form onSubmit={handleAvatarSubmit}>
        <AvatarContainer>
          {user?.avatar ? (
            <Avatar src={`http://localhost:5000${user.avatar}`} alt="Avatar" />
          ) : (
            <AvatarPlaceholder>
              {user?.username?.charAt(0).toUpperCase()}
            </AvatarPlaceholder>
          )}
          <div>
            <FileInputLabel htmlFor="avatar-input">
              Choose Avatar
            </FileInputLabel>
            <FileInput
              id="avatar-input"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
            />
            {avatarFile && (
              <Button type="submit" disabled={loading} style={{ marginLeft: '1rem' }}>
                Upload
              </Button>
            )}
          </div>
        </AvatarContainer>
      </Form>

      <Form onSubmit={handleProfileSubmit}>
        <Input
          type="text"
          placeholder="Username"
          value={profileForm.username}
          onChange={(e) => setProfileForm({...profileForm, username: e.target.value})}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={profileForm.email}
          onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
          required
        />
        <Input
          type="text"
          placeholder="Full Name"
          value={profileForm.full_name}
          onChange={(e) => setProfileForm({...profileForm, full_name: e.target.value})}
        />
        <Input
          type="tel"
          placeholder="Phone Number"
          value={profileForm.phone}
          onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
        />
        <Input
          type="text"
          placeholder="Address"
          value={profileForm.address}
          onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
        />
        
        <h3>Change Password (optional)</h3>
        <Input
          type="password"
          placeholder="Current Password"
          value={profileForm.currentPassword}
          onChange={(e) => setProfileForm({...profileForm, currentPassword: e.target.value})}
        />
        <Input
          type="password"
          placeholder="New Password"
          value={profileForm.newPassword}
          onChange={(e) => setProfileForm({...profileForm, newPassword: e.target.value})}
        />
        <Input
          type="password"
          placeholder="Confirm New Password"
          value={profileForm.confirmPassword}
          onChange={(e) => setProfileForm({...profileForm, confirmPassword: e.target.value})}
        />
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </Button>
      </Form>
    </div>
  );

  const renderTransactionsTab = () => (
    <div>
      <h2>My Transactions</h2>
      {loading && <LoadingMessage>Loading transactions...</LoadingMessage>}
      {!loading && transactions.length === 0 && <p>No transactions found.</p>}
      {!loading && transactions.length > 0 && (
        <Table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Amount</th>
              <th>Voucher</th>
              <th>Status</th>
              <th>Payment Proof</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.product_title}</td>
                <td>Rp {transaction.final_price.toLocaleString()}</td>
                <td>{transaction.voucher_code || '-'}</td>
                <td>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    background: transaction.status === 'confirmed' ? '#28a745' : 
                               transaction.status === 'pending' ? '#ffc107' : 
                               transaction.status === 'cancelled' ? '#fd7e14' : '#dc3545',
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
                      style={{ color: '#007bff' }}
                    >
                      View
                    </a>
                  ) : '-'}
                </td>
                <td>{new Date(transaction.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );

  return (
    <ProfileContainer>
      <Title>My Profile</Title>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      
      <TabContainer>
        <Tab 
          active={activeTab === 'profile'} 
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </Tab>
        <Tab 
          active={activeTab === 'transactions'} 
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </Tab>
      </TabContainer>
      
      <Card>
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'transactions' && renderTransactionsTab()}
      </Card>
    </ProfileContainer>
  );
};

export default UserProfile;
