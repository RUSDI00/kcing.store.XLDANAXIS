import React from 'react';
import styled from 'styled-components';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import products from '../data/products';
import { FaShieldAlt, FaMoneyBillWave, FaRegClock } from 'react-icons/fa';
import { Icon } from '../components/IconWrapper';

const HomeContainer = styled.div`
  min-height: 100vh;
`;

const ProductsSection = styled.section`
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2rem;
  margin-bottom: 3rem;
  color: #1a1a2e;
  
  &::after {
    content: "";
    display: block;
    width: 100px;
    height: 4px;
    background: #1CB0F6;
    margin: 1rem auto 0;
    border-radius: 2px;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

const FeatureSection = styled.section`
  background-color: #f7f7f7;
  padding: 4rem 2rem;
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  text-align: center;
  
  svg {
    font-size: 2.5rem;
    color: #1CB0F6;
    margin-bottom: 1.2rem;
  }
  
  h3 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: #1a1a2e;
  }
  
  p {
    color: #666;
    line-height: 1.6;
  }
`;

const HomePage: React.FC = () => {
  return (
    <HomeContainer>
      <Hero />
      
      <ProductsSection>
        <SectionTitle>Pilihan Kuota Terbaik</SectionTitle>
        <ProductGrid>
          {products.map((product) => (
            <ProductCard 
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              dataSize={product.dataSize}
            />
          ))}
        </ProductGrid>
      </ProductsSection>
      
      <FeatureSection>
        <SectionTitle>Mengapa Memilih Kami?</SectionTitle>
        <Features>
          <FeatureCard>
            <Icon icon={FaShieldAlt} />
            <h3>Terpercaya & Bergaransi</h3>
            <p>Kuota bergaransi dengan masa aktif full 29-30 hari. Kami menjamin kepuasan pelanggan dengan layanan yang amanah.</p>
          </FeatureCard>
          
          <FeatureCard>
            <Icon icon={FaMoneyBillWave} />
            <h3>Pembayaran Mudah</h3>
            <p>Pembayaran setelah kuota masuk. Tersedia berbagai metode pembayaran termasuk Qris untuk kenyamanan pelanggan.</p>
          </FeatureCard>
          
          <FeatureCard>
            <Icon icon={FaRegClock} />
            <h3>Proses Cepat</h3>
            <p>Pengisian cukup dengan mengirimkan nomor. Kami menjamin proses pengisian yang cepat dan tanpa ribet.</p>
          </FeatureCard>
        </Features>
      </FeatureSection>
    </HomeContainer>
  );
};

export default HomePage;
