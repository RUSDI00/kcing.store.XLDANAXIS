import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
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
  align-items: center;
  
  a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: white;
    text-decoration: none;
    transition: color 0.3s;
    
    &:hover {
      color: #1CB0F6;
    }
  }
`;

const AuthSection = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const AuthLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 4px;
  transition: all 0.3s;

  &:hover {
    color: #1CB0F6;
    border-color: #1CB0F6;
  }

  &.login {
    border-color: white;
  }

  &.register {
    background: #1CB0F6;
    border-color: #1CB0F6;
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserName = styled.span`
  color: white;
  font-weight: 500;
`;

const LogoutButton = styled.button`
  background: none;
  border: 1px solid white;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: inherit;
  line-height: inherit;
  white-space: nowrap;

  &:hover {
    background: white;
    color: #1a1a2e;
  }
`;

const ProfileButton = styled(Link)`
  background: none;
  border: 1px solid white;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.3s;
  display: inline-block;
  font-size: inherit;
  line-height: inherit;
  white-space: nowrap;

  &:hover {
    background: white;
    color: #1a1a2e;
  }
`;

const AdminButton = styled(Link)`
  background: none;
  border: 1px solid white;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.3s;
  display: inline-block;
  font-size: inherit;
  line-height: inherit;
  white-space: nowrap;

  &:hover {
    background: white;
    color: #1a1a2e;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Header: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
        <HeaderRight>
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
          
          {loading ? (
            <div>Loading...</div>
          ) : user ? (
            <UserMenu>
              {user.avatar && (
                <UserAvatar src={`http://localhost:5000${user.avatar}`} alt="Avatar" />
              )}
              <UserName>{user.username}</UserName>
              <ProfileButton to="/profile">Profile</ProfileButton>
              {user.role === 'admin' && (
                <AdminButton to="/admin">Admin</AdminButton>
              )}
              <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
            </UserMenu>
          ) : (
            <AuthSection>
              <AuthLink to="/login" className="login">Login</AuthLink>
              <AuthLink to="/register" className="register">Register</AuthLink>
            </AuthSection>
          )}
        </HeaderRight>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
