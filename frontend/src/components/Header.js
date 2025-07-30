import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-weight: bold;
`;

const LogoText = styled.div`
  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #333;
    margin: 0;
  }
  
  p {
    font-size: 0.875rem;
    color: #666;
    margin: 0;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled.a`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease-in-out;
  
  &:hover {
    color: #667eea;
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #e8f5e8;
  border-radius: 20px;
  font-size: 0.875rem;
  color: #2d5a2d;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  background: #28a745;
  border-radius: 50%;
  animation: pulse 2s infinite;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo>
          <LogoIcon>⚡</LogoIcon>
          <LogoText>
            <h1>EV Routing Simulation</h1>
            <p>Amsterdam Electric Vehicle Route Optimization</p>
          </LogoText>
        </Logo>
        
        <Nav>
          <NavLink href="#simulator">Route Simulator</NavLink>
          <NavLink href="#about">About</NavLink>
          <NavLink href="#docs">Documentation</NavLink>
          <StatusIndicator>
            <StatusDot />
            <span>API Connected</span>
          </StatusIndicator>
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header; 