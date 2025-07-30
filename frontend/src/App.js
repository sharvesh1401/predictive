import React from 'react';
import styled from 'styled-components';
import RouteSimulator from './components/RouteSimulator';
import Header from './components/Header';
import './App.css';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const MainContent = styled.main`
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
`;

function App() {
  return (
    <AppContainer>
      <Header />
      <MainContent>
        <RouteSimulator />
      </MainContent>
    </AppContainer>
  );
}

export default App; 