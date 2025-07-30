import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/Home';
import SimulationPage from './pages/Simulation';
import ResultsPage from './pages/Results';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><HomePage /></Layout>,
  },
  {
    path: '/simulation',
    element: <Layout><SimulationPage /></Layout>,
  },
  {
    path: '/results',
    element: <Layout><ResultsPage /></Layout>,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
