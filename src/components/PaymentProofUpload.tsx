import React, { useState } from 'react';
import styled from 'styled-components';
import { CheckCircleIcon, WhatsappIcon, UploadIcon as UploadIconComponent } from './IconWrapper';
import { transactionAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface PaymentProofUploadProps {
  transactionId: number;
  amount: number;
  productTitle: string;
  phoneNumber: string;
  onSuccess?: () => void;
  onBack: () => void;
}

const PaymentProofContainer = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const Title = styled.h3`
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
`;

const Description = styled.p`
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.5;
`;

const UploadArea = styled.div<{ isDragging: boolean; hasFile: boolean }>`
  border: 2px dashed ${props => props.isDragging ? '#1CB0F6' : props.hasFile ? '#2ecc71' : '#ddd'};
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  background: ${props => props.isDragging ? '#f0f8ff' : props.hasFile ? '#f0fff4' : '#fff'};
  transition: all 0.3s ease;
  cursor: ${props => props.hasFile ? 'default' : 'pointer'};
  margin-bottom: 1.5rem;

  &:hover {
    border-color: ${props => props.hasFile ? '#2ecc71' : '#1CB0F6'};
    background: ${props => props.hasFile ? '#f0fff4' : '#f0f8ff'};
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  color: #1CB0F6;
  margin-bottom: 1rem;
`;

const UploadText = styled.p`
  color: #666;
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  margin: 1rem 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const FileName = styled.p`
  color: #333;
  font-weight: 500;
  margin: 0.5rem 0;
  word-break: break-all;
`;

const ChangeFileButton = styled.button`
  background: #f39c12;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 0.5rem;

  &:hover {
    background: #e67e22;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ConfirmButton = styled.button`
  background: #25D366;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  flex: 1;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #128C7E;
  }
`;

const BackButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  flex: 1;

  &:hover {
    background: #5a6268;
  }
`;

const LoadingText = styled.p`
  text-align: center;
  color: #666;
  margin: 1rem 0;
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c53030;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border-left: 4px solid #c53030;
`;

const PaymentProofUpload: React.FC<PaymentProofUploadProps> = ({
  transactionId,
  amount,
  productTitle,
  phoneNumber,
  onSuccess,
  onBack
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const { user } = useAuth();

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size must be less than 10MB');
        return;
      }
      
      setError('');
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setError('Please select an image file (PNG, JPG, JPEG)');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedFile) {
      setError('Please select a payment proof image');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Upload payment proof to backend
      await transactionAPI.uploadPaymentProof(transactionId, selectedFile);

      // Format WhatsApp message
      const formatCurrency = (value: number) => {
        return `Rp${value.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
      };

      const message = `Halo admin KCING Store,

Saya telah melakukan pembayaran untuk pesanan:

• Nama: ${user?.full_name || 'Customer'}
• Username: ${user?.username}
• No. HP: ${phoneNumber}
• Produk: ${productTitle}
• Total: ${formatCurrency(amount)}

Bukti pembayaran sudah saya upload di sistem. Mohon diproses ya, terima kasih!`;

      const whatsappUrl = `https://wa.me/6282268913491?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload payment proof');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setError('');
  };

  return (
    <PaymentProofContainer>
      <Title>Upload Bukti Pembayaran</Title>
      <Description>
        Sudah bayar? Silahkan upload screenshot bukti pembayaran dan tekan konfirmasi untuk melanjutkan ke WhatsApp admin.
      </Description>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {!selectedFile ? (
        <UploadArea
          isDragging={isDragging}
          hasFile={false}
          onClick={() => document.getElementById('fileInput')?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadIcon>
            <UploadIconComponent size={48} color="#1CB0F6" />
          </UploadIcon>
          <UploadText>
            Klik untuk pilih gambar atau drag & drop file gambar di sini
          </UploadText>
          <UploadText style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#999' }}>
            Format: JPG, PNG, JPEG (Max 10MB)
          </UploadText>
        </UploadArea>
      ) : (
        <UploadArea isDragging={false} hasFile={true}>
          <CheckCircleIcon size={32} color="#2ecc71" />
          <PreviewImage src={previewUrl} alt="Bukti Pembayaran" />
          <FileName>{selectedFile.name}</FileName>
          <ChangeFileButton onClick={removeFile}>
            Ganti File
          </ChangeFileButton>
        </UploadArea>
      )}

      <FileInput
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
      />

      {uploading && (
        <LoadingText>Uploading payment proof...</LoadingText>
      )}

      <ButtonGroup>
        <BackButton onClick={onBack} disabled={uploading}>
          Kembali
        </BackButton>
        <ConfirmButton
          disabled={!selectedFile || uploading}
          onClick={handleConfirmPayment}
        >
          <WhatsappIcon size={20} color="#fff" />
          {uploading ? 'Uploading...' : 'Konfirmasi ke WhatsApp'}
        </ConfirmButton>
      </ButtonGroup>
    </PaymentProofContainer>
  );
};

export default PaymentProofUpload;
