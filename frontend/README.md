# 🚗⚡ EV Routing Simulation - Frontend

React-based frontend for the EV routing simulation tool, featuring an interactive map, route visualization, and comprehensive statistics display.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
frontend/
├── public/
│   ├── index.html          # Main HTML template
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/
│   │   ├── Header.js       # Application header
│   │   ├── RouteSimulator.js # Main simulator component
│   │   ├── RouteForm.js    # Route configuration form
│   │   ├── RouteMap.js     # Interactive map component
│   │   ├── RouteResults.js # Route statistics display
│   │   └── RouteComparison.js # Route comparison view
│   ├── services/
│   │   └── api.js          # API communication service
│   ├── App.js              # Main application component
│   ├── App.css             # Global styles
│   ├── index.js            # Application entry point
│   └── index.css           # Base styles
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🎨 Features

### Interactive Map
- **Leaflet Integration**: OpenStreetMap-based visualization
- **Route Display**: Visual route paths with different colors
- **Markers**: Start/end points and charging stations
- **Responsive**: Works on desktop and mobile devices

### Route Configuration
- **Location Selection**: Dropdown menus for Amsterdam locations
- **Driver Profiles**: Eco, Aggressive, and Balanced options
- **Battery Settings**: Capacity and current charge configuration
- **Algorithm Selection**: Dijkstra, A*, and Multi-objective options
- **AI Enhancement**: Optional AI-powered optimization

### Results Display
- **Route Statistics**: Distance, time, energy, cost, and emissions
- **Charging Stops**: Detailed information about charging stations
- **Visual Charts**: Bar charts for metric comparison
- **AI Insights**: AI enhancement suggestions and reasoning

### Route Comparison
- **Side-by-side Analysis**: Compare multiple routing algorithms
- **Performance Metrics**: Best routes by different criteria
- **Visual Comparison**: Color-coded route visualization
- **Summary Cards**: Quick overview of each algorithm's performance

## 🛠️ Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Key Dependencies

- **React 18**: Modern React with hooks
- **Leaflet**: Interactive maps
- **React-Leaflet**: React wrapper for Leaflet
- **Axios**: HTTP client for API communication
- **React-Select**: Enhanced select components
- **Recharts**: Data visualization charts
- **Styled-Components**: CSS-in-JS styling

### Styling

The application uses a combination of:
- **Styled-Components**: For component-specific styles
- **CSS Modules**: For global styles
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Clean, professional interface

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```bash
REACT_APP_API_URL=http://localhost:8000
REACT_APP_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

### API Configuration

The frontend communicates with the backend API through the `api.js` service:

```javascript
import { calculateRoute, compareRoutes } from '../services/api';

// Example usage
const routeData = await calculateRoute({
  origin: 'Amsterdam_Central',
  destination: 'Museumplein',
  driverProfile: 'eco',
  routingModel: 'dijkstra'
});
```

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full-featured interface with sidebar layout
- **Tablet**: Adapted layout with collapsible sidebar
- **Mobile**: Single-column layout optimized for touch

## 🎯 User Experience

### Intuitive Interface
- **Clear Navigation**: Easy-to-understand layout
- **Visual Feedback**: Loading states and animations
- **Error Handling**: User-friendly error messages
- **Accessibility**: WCAG compliant design

### Performance
- **Lazy Loading**: Components load on demand
- **Optimized Bundles**: Efficient code splitting
- **Fast Rendering**: Optimized React components
- **Caching**: API response caching

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Test Coverage
```bash
npm test -- --coverage
```

### Testing Strategy
- **Unit Tests**: Individual component testing
- **Integration Tests**: API communication testing
- **E2E Tests**: Full user journey testing

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based deployment
- **AWS S3**: Static hosting
- **Docker**: Containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

---

**Built with React and modern web technologies for sustainable urban mobility** 