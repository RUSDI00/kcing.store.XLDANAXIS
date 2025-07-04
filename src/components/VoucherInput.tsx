import React, { useState } from 'react';
import styled from 'styled-components';
import { voucherAPI } from '../services/api';

interface VoucherInputProps {
  amount: number;
  onVoucherApplied: (voucherData: {
    code: string;
    discount_amount: number;
    final_amount: number;
  }) => void;
  onVoucherRemoved: () => void;
  disabled?: boolean;
}

const VoucherContainer = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
`;

const VoucherTitle = styled.h4`
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1rem;
`;

const VoucherForm = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const VoucherInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #007bff;
  }

  &:disabled {
    background: #f8f9fa;
    cursor: not-allowed;
  }
`;

const ApplyButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #218838;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const RemoveButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: #c82333;
  }
`;

const VoucherInfo = styled.div`
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 6px;
  padding: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const VoucherDetails = styled.div`
  color: #155724;
  
  .code {
    font-weight: 600;
    text-transform: uppercase;
  }
  
  .discount {
    font-size: 0.9rem;
    margin-top: 0.25rem;
  }
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  padding: 0.75rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
`;

const LoadingText = styled.div`
  color: #6c757d;
  font-size: 0.9rem;
  text-align: center;
  margin: 0.5rem 0;
`;

const VoucherInputComponent: React.FC<VoucherInputProps> = ({
  amount,
  onVoucherApplied,
  onVoucherRemoved,
  disabled = false
}) => {
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      setError('Please enter a voucher code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await voucherAPI.validateVoucher(voucherCode.trim().toUpperCase(), amount);
      const voucherData = response.data;

      setAppliedVoucher(voucherData);
      onVoucherApplied({
        code: voucherData.voucher.code,
        discount_amount: voucherData.discount_amount,
        final_amount: voucherData.final_amount
      });
      setVoucherCode('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid voucher code');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode('');
    setError('');
    onVoucherRemoved();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyVoucher();
    }
  };

  const formatCurrency = (value: number) => {
    return `Rp${value.toLocaleString('id-ID')}`;
  };

  return (
    <VoucherContainer>
      <VoucherTitle>🎫 Punya Kode Voucher?</VoucherTitle>
      
      {!appliedVoucher ? (
        <>
          <VoucherForm>
            <VoucherInput
              type="text"
              placeholder="Masukkan kode voucher"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              disabled={disabled || loading}
            />
            <ApplyButton
              onClick={handleApplyVoucher}
              disabled={disabled || loading || !voucherCode.trim()}
            >
              {loading ? 'Checking...' : 'Apply'}
            </ApplyButton>
          </VoucherForm>
          
          {loading && <LoadingText>Validating voucher...</LoadingText>}
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </>
      ) : (
        <VoucherInfo>
          <VoucherDetails>
            <div className="code">✅ {appliedVoucher.voucher.code}</div>
            <div className="discount">
              Discount: {formatCurrency(appliedVoucher.discount_amount)}
            </div>
          </VoucherDetails>
          <RemoveButton onClick={handleRemoveVoucher}>
            Remove
          </RemoveButton>
        </VoucherInfo>
      )}
    </VoucherContainer>
  );
};

export default VoucherInputComponent;
