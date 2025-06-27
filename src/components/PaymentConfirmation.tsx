import React, { useState } from 'react';
import styled from 'styled-components';
import { UploadIcon, CheckIcon } from './IconWrapper';

interface PaymentConfirmationProps {
  productName: string;
  phoneNumber: string;
  price: number;
  paymentMethod: string;
  onConfirm: (transactionId: string, screenshot: File | null) => void;
}

const ConfirmationContainer = styled.div`
  background: #f9f9f9;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #1a1a2e;
`;

const FormGroup = styled.div`
  margin-bottom: 1.2rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    font-size: 0.9rem;
  }
  
  input {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 0.9rem;
    
    &:focus {
      outline: none;
      border-color: #1CB0F6;
    }
  }
`;

const FileInputContainer = styled.div`
  position: relative;
  margin-bottom: 1.2rem;
`;

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fff;
  border: 1px dashed #1CB0F6;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  text-align: center;
  color: #1a1a2e;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(28, 176, 246, 0.05);
  }
  
  svg {
    color: #1CB0F6;
  }
`;

const HiddenInput = styled.input`
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
`;

const SelectedFile = styled.div`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: #2ecc71;
  }
`;

const ConfirmButton = styled.button`
  display: block;
  width: 100%;
  background: #1CB0F6;
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #0C7ABF;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({ 
  productName, 
  phoneNumber,
  price, 
  paymentMethod,
  onConfirm 
}) => {
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setScreenshot(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (transactionId.trim()) {
      onConfirm(transactionId, screenshot);
    }
  };

  return (
    <ConfirmationContainer>
      <Title>Konfirmasi Pembayaran</Title>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <label htmlFor="transactionId">
            {paymentMethod === 'shopeepay' ? 'ShopeePay Transaction ID' : 'Referensi Pembayaran QRIS'}
          </label>
          <input
            id="transactionId"
            type="text"
            placeholder="Masukkan nomor referensi pembayaran"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            required
          />
        </FormGroup>
        
        <FileInputContainer>
          <FileInputLabel htmlFor="screenshot">
            <UploadIcon />
            Unggah Bukti Pembayaran (Opsional)
          </FileInputLabel>
          <HiddenInput
            id="screenshot"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {screenshot && (
            <SelectedFile>
              <CheckIcon />
              {screenshot.name}
            </SelectedFile>
          )}
        </FileInputContainer>
        
        <ConfirmButton type="submit" disabled={!transactionId.trim()}>
          Konfirmasi Pembayaran
        </ConfirmButton>
      </form>
    </ConfirmationContainer>
  );
};

export default PaymentConfirmation;
