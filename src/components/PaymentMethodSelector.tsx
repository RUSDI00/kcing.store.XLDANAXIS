import React from 'react';
import styled from 'styled-components';

// Import payment method logos
import shopeepayLogo from '../assets/images/payment-methods/shopeepay-logo.png';
import danaLogo from '../assets/images/payment-methods/dana-logo.png';
import gopayLogo from '../assets/images/payment-methods/gopay-logo.png';
import seabankLogo from '../assets/images/payment-methods/seabank-logo.png';
import bsiLogo from '../assets/images/payment-methods/bsi-logo.png';
import qrisLogo from '../assets/images/payment-methods/qris-logo.png';

interface PaymentMethod {
  id: string;
  name: string;
  account: string;
  accountName: string;
  logo: string;
  description?: string;
  additionalFee?: number;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'shopeepay',
    name: 'ShopeePay',
    account: '082268913491',
    accountName: 'doly yahya',
    logo: shopeepayLogo,
  },
  {
    id: 'dana',
    name: 'DANA',
    account: '082268913491',
    accountName: 'DOLY YAHYA RITONGA',
    logo: danaLogo,
  },
  {
    id: 'gopay',
    name: 'GoPay',
    account: '082268913491',
    accountName: 'Doly Yahya Ritonga',
    logo: gopayLogo,
  },
  {
    id: 'seabank',
    name: 'SeaBank',
    account: '901550484214',
    accountName: 'Doly Yahya Ritonga',
    logo: seabankLogo,
  },
  {
    id: 'bsi',
    name: 'Bank Syariah Indonesia (BSI)',
    account: '7254351975',
    accountName: 'DOLY YAHYA RITONGA',
    logo: bsiLogo,
  },
  {
    id: 'qris',
    name: 'QRIS All Payment',
    account: '',
    accountName: '',
    logo: qrisLogo,
    description: 'Bisa dari semua bank, m-banking dan E-Wallet manapun',
  },
];

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onMethodChange: (method: PaymentMethod) => void;
  amount: number;
}

const PaymentMethodContainer = styled.div`
  margin: 1.5rem 0;
`;

const PaymentMethodTitle = styled.h3`
  color: #1a1a2e;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
`;

const PaymentMethodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const PaymentMethodCard = styled.div<{ selected: boolean }>`
  border: 2px solid ${props => props.selected ? '#1CB0F6' : '#e0e0e0'};
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.selected ? '#f0f9ff' : 'white'};
  position: relative;

  &:hover {
    border-color: #1CB0F6;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(28, 176, 246, 0.15);
  }
`;

const PaymentMethodHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const PaymentMethodLogo = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: contain;
  background: #f5f5f5;
  padding: 4px;
`;

const PaymentMethodName = styled.div`
  font-weight: 600;
  font-size: 1rem;
  color: #1a1a2e;
  flex: 1;
`;

const SelectedIcon = styled.div<{ visible: boolean }>`
  width: 24px;
  height: 24px;
  background: #1CB0F6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const PaymentMethodDetails = styled.div`
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
`;

const AccountInfo = styled.div`
  margin: 0.5rem 0;
`;

const FeeNotice = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 0.75rem;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #856404;
`;

const PaymentInstructions = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  border-left: 4px solid #1CB0F6;
`;

const InstructionTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #1a1a2e;
  font-size: 1rem;
`;

const InstructionList = styled.ul`
  margin: 0;
  padding-left: 1.2rem;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
  amount
}) => {
  const handleMethodSelect = (method: PaymentMethod) => {
    onMethodChange(method);
  };

  const getFinalAmount = (method: PaymentMethod) => {
    return amount + (method.additionalFee || 0);
  };

  return (
    <PaymentMethodContainer>
      <PaymentMethodTitle>💳 Pilih Metode Pembayaran</PaymentMethodTitle>
      
      <PaymentMethodGrid>
        {paymentMethods.map((method) => (
          <PaymentMethodCard
            key={method.id}
            selected={selectedMethod === method.id}
            onClick={() => handleMethodSelect(method)}
          >
            <PaymentMethodHeader>
              <PaymentMethodLogo 
                src={method.logo} 
                alt={method.name}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) {
                    fallback.style.display = 'flex';
                  }
                }}
              />
              <div style={{
                width: '40px',
                height: '40px',
                background: '#f5f5f5',
                borderRadius: '8px',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: '#666'
              }}>
                {method.name.charAt(0)}
              </div>
              <PaymentMethodName>{method.name}</PaymentMethodName>
              <SelectedIcon visible={selectedMethod === method.id}>
                ✓
              </SelectedIcon>
            </PaymentMethodHeader>
            
            <PaymentMethodDetails>
              {method.account && (
                <AccountInfo>
                  <strong>Nomor:</strong> {method.account}<br />
                  <strong>Atas Nama:</strong> {method.accountName}
                </AccountInfo>
              )}
              
              {method.description && (
                <div style={{ margin: '0.5rem 0', fontStyle: 'italic' }}>
                  {method.description}
                </div>
              )}
              
              {method.additionalFee && (
                <FeeNotice>
                  ⚠️ Biaya tambahan: Rp {method.additionalFee.toLocaleString()}
                  <br />
                  <strong>Total: Rp {getFinalAmount(method).toLocaleString()}</strong>
                </FeeNotice>
              )}
            </PaymentMethodDetails>
          </PaymentMethodCard>
        ))}
      </PaymentMethodGrid>
      
      <PaymentInstructions>
        <InstructionTitle>📋 Petunjuk Pembayaran</InstructionTitle>
        <InstructionList>
          <li>Pilih metode pembayaran yang tersedia di atas</li>
          <li>Transfer sesuai dengan nominal yang tertera</li>
          <li>Simpan bukti transfer/struk pembayaran</li>
          <li>Upload bukti pembayaran setelah transfer</li>
          <li>Pembayaran maksimal 30 menit setelah kuota masuk 🚀</li>
          <li>Hubungi admin melalui WhatsApp untuk konfirmasi</li>
        </InstructionList>
        
        <div style={{ 
          marginTop: '1rem', 
          padding: '0.75rem', 
          background: '#e3f2fd', 
          borderRadius: '6px',
          fontSize: '0.85rem',
          color: '#1565c0'
        }}>
          💝 <strong>Terima kasih telah memilih kcing.hitam!</strong><br />
          Untuk pertanyaan lebih lanjut, silakan hubungi admin kami 🙏🏻
        </div>
      </PaymentInstructions>
    </PaymentMethodContainer>
  );
};

export default PaymentMethodSelector;
