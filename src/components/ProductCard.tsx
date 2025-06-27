import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { StarIcon, CheckCircleIcon } from './IconWrapper';

// Import logo dari assets
import xlLogo from '../assets/logos/xl-logo.png';
import axisLogo from '../assets/logos/axis-logo.png';

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  dataSize: string;
}

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.07);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
`;

const CardTop = styled.div`
  background: linear-gradient(135deg, #1CB0F6, #0C7ABF);
  padding: 1.5rem;
  color: white;
  text-align: center;
  position: relative;
`;

const DataSize = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`;

const Provider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  opacity: 0.9;
  gap: 0.5rem;
  
  img {
    height: 24px;
    width: auto;
  }
`;

const Badge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  backdrop-filter: blur(5px);
  
  svg {
    font-size: 0.8rem;
  }
`;

const CardBody = styled.div`
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Price = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;

  h3 {
    font-size: 1.8rem;
    color: #1a1a2e;
    margin-bottom: 0.2rem;
  }
  
  p {
    color: #666;
    font-size: 0.9rem;
  }
`;

const Features = styled.ul`
  margin-bottom: 1.5rem;
  
  li {
    display: flex;
    align-items: center;
    margin-bottom: 0.8rem;
    color: #444;
    font-size: 0.95rem;
    
    svg {
      color: #1CB0F6;
      margin-right: 10px;
      flex-shrink: 0;
    }
  }
`;

const BuyButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1CB0F6;
  color: white;
  text-align: center;
  padding: 0.8rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  gap: 8px;
  
  &:hover {
    background: #0C7ABF;
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }
`;

const ProductCard: React.FC<ProductCardProps> = ({ id, title, price, dataSize }) => {
  return (
    <Card>
      <CardTop>
        <DataSize>{dataSize}</DataSize>
        <Provider>
          <img src={xlLogo} alt="XL" />
          <span>&</span>
          <img src={axisLogo} alt="AXIS" />
        </Provider>
        <Badge>
          <StarIcon /> Best Value
        </Badge>
      </CardTop>
      <CardBody>
        <Price>
          <h3>Rp. {price.toLocaleString()}</h3>
          <p>Pembayaran setelah kuota masuk</p>
        </Price>
        <Features>
          <li>
            <CheckCircleIcon size={16} />
            Full kuota utama 24 jam
          </li>
          <li>
            <CheckCircleIcon size={16} />
            Masa aktif 29-30 hari
          </li>
          <li>
            <CheckCircleIcon size={16} />
            Pengisian cukup kirim nomor
          </li>
        </Features>
        <BuyButton to={`/checkout/${id}`}>
          Pesan Sekarang <CheckCircleIcon size={14} />
        </BuyButton>
      </CardBody>
    </Card>
  );
};

export default ProductCard;
