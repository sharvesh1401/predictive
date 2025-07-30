# EV Charge Routing Simulation Frontend

A modern, responsive web application for simulating electric vehicle routing and charging strategies. Built with React, Tailwind CSS, and Framer Motion.

## 🚀 Features

### ✨ Modern UI/UX
- **Dark/Light Theme Toggle** - Seamless theme switching with persistent preferences
- **Smooth Animations** - Framer Motion powered transitions and micro-interactions
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Interactive Maps** - Mapbox GL JS integration with animated route visualization

### 🧭 Simulation Dashboard
- **Split View Layout** - Map panel (2/3) and control panel (1/3) for optimal workflow
- **Real-time Route Calculation** - Multiple algorithm support (Dijkstra, A*, AI-powered)
- **Interactive Controls** - Animated sliders, dropdowns, and form elements
- **Live Parameter Updates** - Instant feedback on simulation settings

### 📊 Results & Analytics
- **Comprehensive Charts** - Bar charts, line charts, and pie charts using Recharts
- **Performance Metrics** - Distance, time, energy consumption, and cost analysis
- **Route Comparison** - Side-by-side algorithm performance comparison
- **Export Capabilities** - Download reports in multiple formats

### 🔧 Technical Features
- **State Management** - Zustand for lightweight, persistent state
- **API Integration** - RESTful API communication with error handling
- **Form Validation** - Real-time validation with animated feedback
- **Loading States** - Skeleton screens and progress indicators

## 🛠️ Tech Stack

- **Framework**: React 18
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Maps**: Mapbox GL JS
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd predictive/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:8000
   REACT_APP_MAPBOX_TOKEN=your_mapbox_token_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Navigation and theme toggle
│   ├── Footer.jsx      # Footer with links
│   ├── MapPanel.jsx    # Interactive map component
│   ├── ControlPanel.jsx # Simulation controls
│   └── AnimatedBackground.jsx # Hero background animation
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── Simulation.jsx  # Main simulation dashboard
│   └── Results.jsx     # Results and analytics
├── store/              # State management
│   └── simulationStore.js # Zustand store
├── services/           # API and external services
│   └── api.js         # API client and endpoints
├── lib/               # Utility functions
│   └── utils.js       # Class name utilities
└── index.css          # Global styles and Tailwind
```

## 🎨 Design System

### Colors
- **Primary**: `#BA68ED` (Purple)
- **Background**: `#172144` (Dark) / `#FFFFFF` (Light)
- **Card**: `#1e2a4a` (Dark) / `#FFFFFF` (Light)
- **Border**: `#2d3a5a` (Dark) / `#E5E7EB` (Light)

### Typography
- **Headings**: Inter font family
- **Body**: System font stack
- **Code**: Monospace font

### Spacing
- **Container**: `max-w-7xl` (1280px)
- **Padding**: `p-4` (16px) to `p-8` (32px)
- **Gap**: `gap-4` (16px) to `gap-8` (32px)

## 🔌 API Integration

The frontend communicates with the backend through RESTful APIs:

### Endpoints
- `POST /api/calculate-routes` - Calculate optimal routes
- `GET /api/charging-stations` - Get charging station data
- `POST /api/optimize-route` - AI-powered route optimization
- `GET /api/simulation/{id}` - Get simulation results
- `POST /api/simulation` - Save simulation data
- `GET /api/export/{id}` - Export results

### Mock Data
For development, the app includes mock API responses that simulate real backend behavior.

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Docker Deployment
```bash
docker build -t ev-routing-frontend .
docker run -p 3000:3000 ev-routing-frontend
```

## 🧪 Development

### Available Scripts
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Code Style
- Use functional components with hooks
- Follow React best practices
- Use Tailwind CSS for styling
- Implement proper error boundaries
- Add loading states for async operations

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: `< 768px`
- **Tablet**: `768px - 1024px`
- **Desktop**: `> 1024px`

## 🎯 Performance

- **Code Splitting** - Route-based code splitting
- **Lazy Loading** - Components loaded on demand
- **Optimized Images** - WebP format with fallbacks
- **Bundle Analysis** - Webpack bundle analyzer integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Sharvesh Selvakumar**
- GitHub: [@sharvesh1401](https://github.com/sharvesh1401)
- Portfolio: [sharveshfolio.netlify.app](https://sharveshfolio.netlify.app)

## 🙏 Acknowledgments

- Mapbox for mapping services
- Framer Motion for animations
- Tailwind CSS for styling
- Recharts for data visualization
- Lucide for beautiful icons 