import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { productAPI } from '../services/api';
import { FaArrowLeft, FaWhatsapp } from 'react-icons/fa';
import { Icon } from '../components/IconWrapper';
import PaymentProofUpload from '../components/PaymentProofUpload';
import VoucherInput from '../components/VoucherInput';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import { useAuth } from '../contexts/AuthContext';
import { transactionAPI } from '../services/api';
import { generateQRIS } from '../services/qrisService';

// Import payment method logos
import shopeepayLogo from '../assets/images/payment-methods/shopeepay-logo.png';
import danaLogo from '../assets/images/payment-methods/dana-logo.png';
import gopayLogo from '../assets/images/payment-methods/gopay-logo.png';
import seabankLogo from '../assets/images/payment-methods/seabank-logo.png';
import bsiLogo from '../assets/images/payment-methods/bsi-logo.png';
import qrisLogo from '../assets/images/payment-methods/qris-logo.png';

interface Product {
  id: number;
  title: string;
  data_size: string;
  price: number;
  is_active: boolean;
}

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

const TotalAmount = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: 700;
  color: #1CB0F6;
  border-top: 2px solid #f0f0f0;
  padding-top: 1rem;
  margin-top: 1rem;
`;

const PaymentButton = styled.button`
  width: 100%;
  background: #28a745;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background: #218838;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Checkout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [showUploadProof, setShowUploadProof] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [transactionId, setTransactionId] = useState<number | null>(null);
  const [qrisData, setQrisData] = useState<{
    link_qris: string;
    converted_qris: string;
  } | null>(null);
  const [loadingQris, setLoadingQris] = useState(false);
  
  // Voucher state
  const [appliedVoucher, setAppliedVoucher] = useState<{
    code: string;
    discount_amount: number;
    final_amount: number;
  } | null>(null);
  
  // Payment method state
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({
    id: 'qris',
    name: 'QRIS All Payment',
    account: '',
    accountName: '',
    logo: '/src/assets/images/payment-methods/qris-logo.png',
    description: 'Bisa dari semua bank, m-banking dan E-Wallet manapun',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentConfirming, setPaymentConfirming] = useState(false);

  // Helper function to get payment method logo
  const getPaymentMethodLogo = (methodId: string) => {
    const logoMap: { [key: string]: string } = {
      'shopeepay': shopeepayLogo,
      'dana': danaLogo,
      'gopay': gopayLogo,
      'seabank': seabankLogo,
      'bsi': bsiLogo,
      'qris': qrisLogo,
    };
    return logoMap[methodId] || qrisLogo;
  };

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/checkout/${id}` } } });
      return;
    }

    const fetchProductAndSet = async () => {
      try {
        const productId = parseInt(id || '0');
        const response = await productAPI.getProducts();
        const foundProduct = response.data.find((p: Product) => p.id === productId);
        
        if (foundProduct) {
          setProduct(foundProduct);
          // Pre-fill phone number from user profile
          if (user?.phone) {
            setPhoneNumber(user.phone);
          }
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        navigate('/');
      }
    };

    fetchProductAndSet();
  }, [id, navigate, isAuthenticated, user]);

  const getCurrentPrice = () => {
    if (!product) return 0;
    const basePrice = appliedVoucher ? appliedVoucher.final_amount : product.price;
    const additionalFee = (selectedPaymentMethod as any).additionalFee || 0;
    return basePrice + additionalFee;
  };

  const getDiscountAmount = () => {
    return appliedVoucher ? appliedVoucher.discount_amount : 0;
  };

  const handlePaymentMethodChange = (method: any) => {
    setSelectedPaymentMethod(method);
  };

  const handleVoucherApplied = (voucherData: {
    code: string;
    discount_amount: number;
    final_amount: number;
  }) => {
    setAppliedVoucher(voucherData);
  };

  const handleVoucherRemoved = () => {
    setAppliedVoucher(null);
  };

  const generateQRISCode = async (amount: number) => {
    setLoadingQris(true);
    setError(''); // Clear previous errors
    
    console.log('=== QRIS Generation Debug ===');
    console.log('Product:', product);
    console.log('Raw amount:', amount);
    console.log('Current price:', getCurrentPrice());
    
    try {
      // Ensure we're using a clean integer amount
      const finalAmount = Math.round(amount);
      console.log('Final amount for QRIS:', finalAmount);
      
      const qrisResponse = await generateQRIS(finalAmount);
      setQrisData({
        link_qris: qrisResponse.link_qris,
        converted_qris: qrisResponse.converted_qris
      });
      console.log('QRIS generated successfully');
    } catch (err: any) {
      console.error('QRIS generation failed:', err);
      setError(err.message || 'Failed to generate QRIS');
    } finally {
      setLoadingQris(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim() || !product || !user) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create transaction in database
      const transactionData = {
        product_id: product.id,
        product_title: product.title,
        product_data_size: product.data_size,
        original_price: product.price,
        voucher_code: appliedVoucher?.code,
        discount_amount: getDiscountAmount(),
        final_price: getCurrentPrice(),
        phone_number: phoneNumber,
        payment_method: selectedPaymentMethod.id
      };

      const response = await transactionAPI.create(transactionData);
      setTransactionId(response.data.transaction_id);
      
      // Generate QRIS only if payment method is QRIS
      if (selectedPaymentMethod.id === 'qris') {
        await generateQRISCode(getCurrentPrice());
      }
      
      setShowPayment(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentComplete = async () => {
    if (transactionId) {
      setPaymentConfirming(true);
      try {
        // Mark payment as confirmed in backend
        await transactionAPI.confirmPayment(transactionId);
        console.log('Payment confirmed successfully');
        setShowUploadProof(true);
        setPaymentComplete(true);
      } catch (error) {
        console.error('Failed to confirm payment:', error);
        setError('Failed to confirm payment. Please try again.');
      } finally {
        setPaymentConfirming(false);
      }
    } else {
      setShowUploadProof(true);
      setPaymentComplete(true);
    }
  };

  const handleWhatsappConfirmation = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior
    
    // First update WhatsApp confirmation status
    if (transactionId) {
      try {
        await transactionAPI.confirmWhatsapp(transactionId);
        console.log('WhatsApp confirmation updated successfully');
      } catch (error) {
        console.error('Failed to update WhatsApp confirmation:', error);
      }
    }
    
    // Open WhatsApp in new tab
    const whatsappUrl = `https://wa.me/6282268913491?text=${formatWhatsAppMessage()}`;
    window.open(whatsappUrl, '_blank');
    
    // Redirect to home after a short delay
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const formatWhatsAppMessage = () => {
    if (!product) return '';
    
    const message = `Halo admin, saya sudah melakukan pembayaran untuk:

• Product: ${product.title}
• Metode Pembayaran: ${selectedPaymentMethod.name}${selectedPaymentMethod.account ? `
• Nomor: ${selectedPaymentMethod.account}` : ''}
• Jumlah: Rp ${getCurrentPrice().toLocaleString()}${appliedVoucher ? `
• Voucher: ${appliedVoucher.code}` : ''}
• Nomor HP: ${phoneNumber}

Mohon dicek ya, terima kasih!`;
    return encodeURIComponent(message);
  };

  // Show upload proof screen
  if (showUploadProof && transactionId && product) {
    return (
      <CheckoutContainer>
        <PaymentProofUpload
          transactionId={transactionId}
          amount={getCurrentPrice()}
          productTitle={product.title}
          phoneNumber={phoneNumber}
          onSuccess={() => {
            // Transaction completed, redirect to home page
            navigate('/');
          }}
          onBack={() => setShowUploadProof(false)}
        />
      </CheckoutContainer>
    );
  }

  // Show QRIS payment screen
  if (showPayment && transactionId && product) {
    return (
      <CheckoutContainer>
        <BackButton onClick={() => setShowPayment(false)}>
          <Icon icon={FaArrowLeft} /> Kembali
        </BackButton>
        
        <CheckoutCard>
          <CardHeader>
            <h2>Pembayaran - {selectedPaymentMethod.name}</h2>
            <p>
              {selectedPaymentMethod.id === 'qris' 
                ? 'Scan QR Code untuk melakukan pembayaran'
                : `Transfer ke ${selectedPaymentMethod.name}`
              }
            </p>
          </CardHeader>
          
          <CardBody>
            {selectedPaymentMethod.id === 'qris' ? (
              // QRIS Payment Section
              <>
                {loadingQris ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>Generating QRIS...</p>
                  </div>
                ) : qrisData ? (
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <img 
                      src={qrisData.link_qris} 
                      alt="QRIS Code" 
                      style={{ maxWidth: '300px', width: '100%' }}
                    />
                    <p style={{ marginTop: '1rem', color: '#666' }}>
                      Scan QR Code dengan aplikasi e-wallet atau mobile banking
                    </p>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
                    <p>Failed to generate QRIS. Please try again.</p>
                    <button onClick={() => generateQRISCode(getCurrentPrice())}>
                      Retry Generate QRIS
                    </button>
                  </div>
                )}
              </>
            ) : (
              // Manual Payment Method Section
              <div style={{ 
                background: '#f8f9fa', 
                border: '2px solid #1CB0F6', 
                borderRadius: '12px', 
                padding: '2rem', 
                textAlign: 'center',
                marginBottom: '2rem' 
              }}>
                <h3 style={{ color: '#1a1a2e', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <img 
                    src={getPaymentMethodLogo(selectedPaymentMethod.id)} 
                    alt={selectedPaymentMethod.name}
                    style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                  />
                  {selectedPaymentMethod.name}
                </h3>
                {selectedPaymentMethod.account && (
                  <>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1CB0F6', marginBottom: '0.5rem' }}>
                      {selectedPaymentMethod.account}
                    </div>
                    <div style={{ fontSize: '1.1rem', color: '#666', marginBottom: '1rem' }}>
                      Atas Nama: <strong>{selectedPaymentMethod.accountName}</strong>
                    </div>
                  </>
                )}
                <div style={{ 
                  background: '#fff3cd', 
                  border: '1px solid #ffeaa7', 
                  borderRadius: '8px', 
                  padding: '1rem',
                  marginTop: '1rem'
                }}>
                  <p style={{ margin: 0, color: '#856404', fontWeight: '500' }}>
                    💡 Pastikan transfer sesuai dengan nominal yang tertera di bawah
                  </p>
                </div>
              </div>
            )}
            
            <OrderSummary>
              <h3>Detail Pembayaran</h3>
              <OrderItem>
                <span>Produk:</span>
                <span>{product.title}</span>
              </OrderItem>
              <OrderItem>
                <span>Metode Pembayaran:</span>
                <span>{selectedPaymentMethod.name}</span>
              </OrderItem>
              <OrderItem>
                <span>Nomor HP:</span>
                <span>{phoneNumber}</span>
              </OrderItem>
              {appliedVoucher && (
                <>
                  <OrderItem>
                    <span>Harga Asli:</span>
                    <span>Rp. {product.price.toLocaleString()}</span>
                  </OrderItem>
                  <OrderItem style={{ color: '#28a745' }}>
                    <span>Diskon ({appliedVoucher.code}):</span>
                    <span>-Rp. {getDiscountAmount().toLocaleString()}</span>
                  </OrderItem>
                </>
              )}
              {(selectedPaymentMethod as any).additionalFee && (
                <OrderItem style={{ color: '#ff6b6b' }}>
                  <span>Biaya Tambahan:</span>
                  <span>+Rp. {((selectedPaymentMethod as any).additionalFee).toLocaleString()}</span>
                </OrderItem>
              )}
              <TotalAmount>
                <span>Total Pembayaran:</span>
                <span>Rp. {getCurrentPrice().toLocaleString()}</span>
              </TotalAmount>
            </OrderSummary>

            {(selectedPaymentMethod.id === 'qris' ? qrisData : true) && (
              <>
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
                <PaymentButton 
                  type="button"
                  onClick={handlePaymentComplete}
                  disabled={paymentConfirming}
                >
                  {paymentConfirming ? 'Memproses...' : 'Sudah Bayar'}
                </PaymentButton>
              </>
            )}
          </CardBody>
        </CheckoutCard>
      </CheckoutContainer>
    );
  }

  if (!product || !user) {
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
                  <span>{product.data_size}</span>
                </OrderItem>
                {appliedVoucher && (
                  <>
                    <OrderItem>
                      <span>Harga Asli:</span>
                      <span>Rp. {product.price.toLocaleString()}</span>
                    </OrderItem>
                    <OrderItem style={{ color: '#28a745' }}>
                      <span>Diskon ({appliedVoucher.code}):</span>
                      <span>-Rp. {getDiscountAmount().toLocaleString()}</span>
                    </OrderItem>
                  </>
                )}
                {(selectedPaymentMethod as any).additionalFee && (
                  <OrderItem style={{ color: '#ff6b6b' }}>
                    <span>Biaya {selectedPaymentMethod.name}:</span>
                    <span>+Rp. {((selectedPaymentMethod as any).additionalFee).toLocaleString()}</span>
                  </OrderItem>
                )}
                <OrderItem className="total">
                  <span>Total:</span>
                  <span>Rp. {getCurrentPrice().toLocaleString()}</span>
                </OrderItem>
              </OrderSummary>

              <VoucherInput
                amount={product.price}
                onVoucherApplied={handleVoucherApplied}
                onVoucherRemoved={handleVoucherRemoved}
                disabled={loading}
              />

              <PaymentMethodSelector
                selectedMethod={selectedPaymentMethod.id}
                onMethodChange={handlePaymentMethodChange}
                amount={appliedVoucher ? appliedVoucher.final_amount : product.price}
              />
              
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
              
              <CheckoutButton type="submit" disabled={!phoneNumber.trim() || loading}>
                {loading ? 'Memproses...' : 'Lanjutkan ke Pembayaran'}
              </CheckoutButton>
            </form>
          ) : (
            <SuccessMessage>
              <h3>Pembayaran Berhasil!</h3>
              <p>
                Terima kasih telah melakukan pembayaran. Silakan hubungi admin melalui WhatsApp untuk konfirmasi.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <WhatsappButton 
                  href="#"
                  onClick={handleWhatsappConfirmation}
                >
                  <Icon icon={FaWhatsapp} /> Hubungi Admin via WhatsApp
                </WhatsappButton>
                <CheckoutButton 
                  onClick={() => navigate('/')}
                  style={{ background: '#007bff', maxWidth: '250px' }}
                >
                  Kembali ke Beranda
                </CheckoutButton>
              </div>
            </SuccessMessage>
          )}
        </CardBody>
      </CheckoutCard>
    </CheckoutContainer>
  );
};

export default Checkout;
