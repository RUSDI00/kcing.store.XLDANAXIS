import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import products from '../data/products';
import { FaArrowLeft, FaWhatsapp } from 'react-icons/fa';
import qrisImage from '../assets/images/qris.jpg';
import { Icon } from '../components/IconWrapper';

const CheckoutContainer = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1.5rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  color: #1a1a2e;
  font-size: 1rem;
  padding: 0.5rem;
  margin-bottom: 2rem;
  transition: color 0.3s;
  
  &:hover {
    color: #1CB0F6;
  }
`;

const CheckoutCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const CardHeader = styled.div`
  background: linear-gradient(135deg, #1CB0F6, #0C7ABF);
  padding: 1.5rem;
  color: white;
  
  h2 {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
  }
`;

const CardBody = styled.div`
  padding: 2.5rem;
`;

const OrderSummary = styled.div`
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.3rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.8rem;
    margin-bottom: 1.2rem;
    color: #1a1a2e;
  }
`;

const OrderItem = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  margin-bottom: 0.8rem;
  font-size: 1rem;
  
  span:last-child {
    font-weight: 600;
  }
  
  &.total {
    font-size: 1.2rem;
    font-weight: 600;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px dashed #ddd;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #1a1a2e;
  }
  
  input {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s;
    
    &:focus {
      outline: none;
      border-color: #1CB0F6;
    }
  }
`;

const PaymentSection = styled.div`
  margin-top: 2rem;
  
  h3 {
    font-size: 1.3rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.8rem;
    margin-bottom: 1.2rem;
    color: #1a1a2e;
  }
`;

const QRISContainer = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  img {
    max-width: 350px;
    width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1rem;
    color: #666;
    margin: 0.5rem 0;
  }
  
  .amount {
    font-size: 1.2rem;
    font-weight: 600;
    color: #1a1a2e;
  }
`;

const PaymentInstructions = styled.div`
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  
  h4 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #1a1a2e;
    font-size: 1.2rem;
  }
  
  ol {
    margin: 0;
    padding-left: 1.2rem;
    
    li {
      margin-bottom: 0.8rem;
      line-height: 1.5;
    }
  }
`;

const CheckoutButton = styled.button`
  display: block;
  width: 100%;
  background: #1CB0F6;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.1rem;
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

const SuccessMessage = styled.div`
  text-align: center;
  padding: 2rem;
  
  h3 {
    color: #2ecc71;
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 1.5rem;
  }
`;

const WhatsappButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #25D366;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #128C7E;
  }
`;

const Checkout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentComplete, setPaymentComplete] = useState(false);

  useEffect(() => {
    const productId = parseInt(id || '0');
    const foundProduct = products.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim() && product) {
      setPaymentComplete(true);
    }
  };

  const formatWhatsAppMessage = () => {
    return encodeURIComponent(
      `kak saya sudah bayar mohon diproses\n\n` +
      `Nomor: ${phoneNumber}\n` +
      `Produk: ${product.title}\n` +
      `Kuota Data: ${product.dataSize}\n` +
      `Total: Rp. ${product.price.toLocaleString()}`
    );
  };

  if (!product) {
    return <CheckoutContainer>Loading...</CheckoutContainer>;
  }

  return (
    <CheckoutContainer>
      <BackButton onClick={() => navigate('/')}>
        <Icon icon={FaArrowLeft} /> Kembali ke Beranda
      </BackButton>
      
      <CheckoutCard>
        <CardHeader>
          <h2>Checkout</h2>
          <p>{!paymentComplete ? 'Pembayaran gampang, cepat, dan aman hanya dengan QRIS!' : 'Pembayaran selesai!'}</p>
        </CardHeader>
        
        <CardBody>
          {!paymentComplete ? (
            <form onSubmit={handleSubmit}>
              <OrderSummary>
                <h3>Ringkasan Pesanan</h3>
                <OrderItem>
                  <span>Produk:</span>
                  <span>{product.title}</span>
                </OrderItem>
                <OrderItem>
                  <span>Kuota Data:</span>
                  <span>{product.dataSize}</span>
                </OrderItem>
                <OrderItem className="total">
                  <span>Total:</span>
                  <span>Rp. {product.price.toLocaleString()}</span>
                </OrderItem>
              </OrderSummary>
              
              <FormGroup>
                <label htmlFor="phone">Nomor Telepon (XL/AXIS)</label>
                <input 
                  id="phone"
                  type="text" 
                  placeholder="Contoh: 081234567890"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  required
                />
              </FormGroup>
              
              <PaymentSection>
                <h3>Pembayaran QRIS</h3>
                <QRISContainer>
                  <img src={qrisImage} alt="QRIS Payment" />
                  <p>Scan QR Code di atas untuk melakukan pembayaran</p>
                  <p className="amount">Rp. {product.price.toLocaleString()}</p>
                </QRISContainer>
                
                <PaymentInstructions>
                  <h4>Cara Pembayaran:</h4>
                  <ol>
                    <li>Scan QR Code dengan aplikasi e-wallet atau mobile banking</li>
                    <li>Pastikan nominal sesuai dengan harga paket</li>
                    <li>Masukkan nomor telepon dengan benar</li>
                    <li>Klik tombol "Konfirmasi Pembayaran" setelah transfer berhasil</li>
                  </ol>
                </PaymentInstructions>
              </PaymentSection>
              
              <CheckoutButton type="submit" disabled={!phoneNumber.trim()}>
                Konfirmasi Pembayaran
              </CheckoutButton>
            </form>
          ) : (
            <SuccessMessage>
              <h3>Pembayaran Berhasil!</h3>
              <p>
                Terima kasih telah melakukan pembayaran. Klik tombol di bawah untuk menghubungi admin melalui WhatsApp.
              </p>
              <WhatsappButton 
                href={`https://wa.me/6282268913491?text=${formatWhatsAppMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon icon={FaWhatsapp} /> Hubungi Admin via WhatsApp
              </WhatsappButton>
            </SuccessMessage>
          )}
        </CardBody>
      </CheckoutCard>
    </CheckoutContainer>
  );
};

export default Checkout;
