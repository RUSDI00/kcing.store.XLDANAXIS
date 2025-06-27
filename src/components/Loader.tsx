import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 2rem;
`;

const SpinnerOuter = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(28, 176, 246, 0.2);
  border-radius: 50%;
  border-top-color: #1CB0F6;
  animation: ${spin} 1s infinite ease-in-out;
`;

const Loader: React.FC = () => {
  return (
    <LoaderContainer>
      <SpinnerOuter />
    </LoaderContainer>
  );
};

export default Loader;
