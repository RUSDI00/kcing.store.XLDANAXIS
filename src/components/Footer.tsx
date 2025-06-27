import React from 'react';
import styled from 'styled-components';
import { WhatsappIcon, InstagramIcon, MapMarkerIcon } from './IconWrapper';

const FooterContainer = styled.footer`
  background-color: #1a1a2e;
  color: white;
  padding: 3rem 0 1.5rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  h3 {
    font-size: 1.2rem;
    margin-bottom: 1.2rem;
    color: #1CB0F6;
  }

  p {
    margin-bottom: 1rem;
    font-size: 0.95rem;
    color: #e2e2e2;
  }

  ul {
    li {
      margin-bottom: 0.8rem;
      
      a {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #e2e2e2;
        transition: color 0.3s;
        
        &:hover {
          color: #1CB0F6;
        }
      }
    }
  }
`;

const Copyright = styled.div`
  max-width: 1200px;
  margin: 2rem auto 0;
  padding: 1.5rem 2rem 0;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
  color: #e2e2e2;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>KCING.HITAM</h3>
          <p>Kuota Termurah XL & AXIS<br />Mudah - Murah - Amanah</p>
          <p>Store: KCING.HITAM STORE, Estd. 2022.</p>
        </FooterSection>

        <FooterSection>
          <h3>Kontak Kami</h3>
          <ul>
            <li>
              <a href="https://wa.me/6282268913491" target="_blank" rel="noopener noreferrer">
                <WhatsappIcon /> 082268913491
              </a>
            </li>
            <li>
              <a href="https://instagram.com/kcing.hitam" target="_blank" rel="noopener noreferrer">
                <InstagramIcon /> @kcing.hitam
              </a>
            </li>
            <li>
              <a href="https://maps.google.com/?q=Rantauprapat+Sumatera+Utara" target="_blank" rel="noopener noreferrer">
                <MapMarkerIcon /> Rantauprapat, Sumatera Utara
              </a>
            </li>
          </ul>
        </FooterSection>

        <FooterSection>
          <h3>Keterangan</h3>
          <ul>
            <li>Full kuota utama 24 jam</li>
            <li>Masa aktif full 29-30 hari (Bergaransi)</li>
            <li>Pengisian cukup kirim nomor saja</li>
            <li>All payment, Qris tersedia</li>
            <li>Pembayaran setelah kuota masuk</li>
          </ul>
        </FooterSection>
      </FooterContent>

      <Copyright>
        &copy; {new Date().getFullYear()} KCING.HITAM Store. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;
