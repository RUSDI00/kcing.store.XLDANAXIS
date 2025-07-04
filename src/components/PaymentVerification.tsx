import React from 'react';
import styled from 'styled-components';

const VerificationContainer = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const PaymentVerification: React.FC = () => {
  return (
    <VerificationContainer>
      <h3>Payment Verification</h3>
      <p>Your payment is being verified. You will be notified once it's confirmed.</p>
    </VerificationContainer>
  );
};

export default PaymentVerification;
