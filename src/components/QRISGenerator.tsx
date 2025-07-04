import React from 'react';
import QRCode from 'react-qr-code';
import styled from 'styled-components';

const QRContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 1rem 0;
`;

const QRTitle = styled.h3`
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
`;

const QRInfo = styled.p`
  color: #666;
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
`;

const Amount = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: #007bff;
  margin: 1rem 0;
`;

interface QRISGeneratorProps {
  amount: number;
  merchantName?: string;
  city?: string;
}

const QRISGenerator: React.FC<QRISGeneratorProps> = ({ 
  amount, 
  merchantName = "KCING.HITAM", 
  city = "Jakarta" 
}) => {
  // Generate QRIS string based on amount and merchant info
  const generateQRISData = () => {
    // This is a simplified QRIS format - in production you'd use proper QRIS spec
    return `00020101021126700014ID.LINKAJA.WWW01189360050300000898240214${merchantName}${city}0303UMI51440014ID.CO.QRIS.WWW0215ID20232967846230303UMI5204481253033605802ID5913${merchantName}6007${city}61052621762070703A0163044B7A`;
  };

  return (
    <QRContainer>
      <QRTitle>Scan QRIS untuk Pembayaran</QRTitle>
      <QRCode
        value={generateQRISData()}
        size={200}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        viewBox="0 0 256 256"
      />
      <Amount>Rp {amount.toLocaleString()}</Amount>
      <QRInfo>
        Scan QR Code di atas menggunakan aplikasi mobile banking atau e-wallet Anda
      </QRInfo>
    </QRContainer>
  );
};

export default QRISGenerator;
