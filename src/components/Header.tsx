import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import kcingLogo from '../assets/logos/kcing-logo.png';
import { WhatsappIcon, InstagramIcon } from './IconWrapper';

const HeaderContainer = styled.header`
  background-color: #1a1a2e;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
`;

const Logo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  img {
    height: 60px;
    margin-bottom: 5px;
  }
  
  .logo-text {
    font-size: 1.2rem;
    color: #ffffff;
    font-weight: 700;
    margin-top: 5px;
  }
  
  span {
    display: block;
    font-size: 0.9rem;
    color: #e2e2e2;
    font-weight: 400;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  gap: 1.5rem;
  
  a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: white;
    transition: color 0.3s;
    
    &:hover {
      color: #1CB0F6;
    }
  }
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Link to="/">
          <Logo>
            <img src={kcingLogo} alt="KCING.HITAM" />
            <div className="logo-text">KCING.HITAM</div>
            <span>Estd. 2022</span>
          </Logo>
        </Link>
        <ContactInfo>
          <a href="https://wa.me/6282268913491" target="_blank" rel="noopener noreferrer">
            <WhatsappIcon size={20} />
            082268913491
          </a>
          <a href="https://instagram.com/kcing.hitam" target="_blank" rel="noopener noreferrer">
            <InstagramIcon size={20} />
            @kcing.hitam
          </a>
        </ContactInfo>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
