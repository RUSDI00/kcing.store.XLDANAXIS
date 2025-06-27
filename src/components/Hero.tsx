import React from 'react';
import styled from 'styled-components';

const HeroContainer = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 5rem 2rem;
  color: white;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2.8rem;
  margin-bottom: 1.5rem;
  
  span {
    color: #1CB0F6;
  }
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const TagLine = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  font-size: 1.1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  
  span {
    display: flex;
    align-items: center;
    
    &::before {
      content: "•";
      color: #1CB0F6;
      margin-right: 10px;
      font-size: 1.5rem;
    }
  }
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    gap: 1rem;
    flex-direction: column;
  }
`;

const Hero: React.FC = () => {
  return (
    <HeroContainer>
      <HeroContent>
        <Title>
          Kuota Termurah <span>XL & AXIS</span>
        </Title>
        <Subtitle>
          Nikmati pengalaman internet tanpa batas dengan paket data berkualitas dari KCING.HITAM Store.
        </Subtitle>
        <TagLine>
          <span>Mudah</span>
          <span>Murah</span>
          <span>Amanah</span>
        </TagLine>
      </HeroContent>
    </HeroContainer>
  );
};

export default Hero;
