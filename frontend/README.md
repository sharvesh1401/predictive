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
- **Performance Optimization** - Debouncing, throttling, and memoization
- **Code Splitting** - Lazy loading and dynamic imports
- **Memory Management** - Automatic cleanup and optimization
- **Component Architecture** - Reusable UI components with variants

### 🔒 **Maximum Security Features**
- **API Key Encryption** - AES-256-GCM encryption for all API keys
- **Secure Storage** - Encrypted local storage with key rotation
- **Rate Limiting** - Comprehensive rate limiting for all API calls
- **Input Sanitization** - XSS, SQL injection, and malicious code prevention
- **CSRF Protection** - Cross-site request forgery prevention
- **Security Monitoring** - Real-time threat detection and alerting
- **API Key Validation** - Format validation and usage tracking
- **Secure HTTP Client** - Encrypted communication with retry logic
- **Content Security Policy** - Comprehensive CSP headers
- **Security Headers** - XSS protection, frame options, and more
- **GDPR Compliance** - Data privacy and user rights protection
- **Audit Logging** - Complete security event logging

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
- **Security**: CryptoJS, AES-256-GCM encryption
- **Monitoring**: Real-time security monitoring

## 🚀 Single-Click Deployment

### 🎯 **Quick Deploy (Recommended)**

**[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sharvesh1401/ev-routing-simulation&env=REACT_APP_MAPBOX_TOKEN,REACT_APP_DEEPSEEK_API_KEY,REACT_APP_GROQ_API_KEY&envDescription=API%20Keys%20for%20the%20application&envLink=https://github.com/sharvesh1401/ev-routing-simulation#environment-variables)**

**Steps:**
1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account
3. Click "Deploy"
4. Your app will be live in 2-3 minutes!

### 🐳 **Docker Deployment**

```bash
# Clone and deploy with one command
git clone https://github.com/sharvesh1401/ev-routing-simulation.git
cd ev-routing-simulation/frontend
docker-compose up -d
```

### 📱 **Local Development**

1. **Clone the repository**
   ```bash
   git clone https://github.com/sharvesh1401/ev-routing-simulation.git
   cd ev-routing-simulation/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

### 🚀 **Automated Deployment Script**

**Windows:**
```bash
# Run the automated deployment script
scripts\deploy.bat
```

**Linux/Mac:**
```bash
# Make script executable and run
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

## 🏗️ Optimized Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   │   ├── Button.jsx  # Reusable button component
│   │   ├── Card.jsx    # Card component with variants
│   │   └── Slider.jsx  # Custom slider component
│   ├── Header.jsx      # Navigation and theme toggle
│   ├── Footer.jsx      # Footer with links
│   ├── MapPanel.jsx    # Interactive map component
│   ├── ControlPanel.jsx # Simulation controls
│   └── AnimatedBackground.jsx # Hero background animation
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── Simulation.jsx  # Main simulation dashboard
│   └── Results.jsx     # Results and analytics
├── hooks/              # Custom React hooks
│   ├── useSimulation.js # Simulation logic hook
│   └── useMap.js       # Map management hook
├── store/              # State management
│   └── simulationStore.js # Zustand store
├── services/           # API and external services
│   └── api.js         # API client and endpoints
├── utils/              # Utility functions
│   ├── performance.js  # Performance optimization utilities
│   └── utils.js        # General utilities
├── constants/          # Application constants
│   └── index.js       # Centralized configuration
├── lib/               # Third-party utilities
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

## 🔐 Environment Setup

### **Required Environment Variables**
Before running the application, you need to set up your API keys:

1. **Copy the example environment file:**
   ```bash
   cp env.example .env.local
   ```

2. **Add your API keys to `.env.local`:**
   ```bash
   # Mapbox API Key (Required for maps)
   REACT_APP_MAPBOX_TOKEN=your_mapbox_token_here
   
   # AI API Keys (Required for AI navigation)
   REACT_APP_DEEPSEEK_API_KEY=your_deepseek_api_key_here
   REACT_APP_GROQ_API_KEY=your_groq_api_key_here
   ```

3. **Get your API keys:**
   - **Mapbox**: [Get Mapbox Token](https://account.mapbox.com/access-tokens/)
   - **DeepSeek**: [Get DeepSeek API Key](https://platform.deepseek.com/)
   - **Groq**: [Get Groq API Key](https://console.groq.com/)

### **Security Note**
- Never commit your `.env.local` file to version control
- API keys are automatically encrypted and secured
- All sensitive data is protected with AES-256-GCM encryption

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

### **Vercel Deployment**
1. **Fork/Clone** this repository
2. **Connect** to Vercel
3. **Deploy** with one click
4. **Configure** environment variables in Vercel dashboard:
   - `REACT_APP_MAPBOX_TOKEN`
   - `REACT_APP_DEEPSEEK_API_KEY`
   - `REACT_APP_GROQ_API_KEY`

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

## 🎯 Performance Optimizations

### **Code Optimization**
- **Code Splitting** - Route-based code splitting with React.lazy
- **Lazy Loading** - Components loaded on demand with intersection observer
- **Bundle Optimization** - Tree shaking and dead code elimination
- **Dynamic Imports** - Heavy components loaded only when needed

### **Runtime Performance**
- **Debouncing** - Expensive operations debounced (300ms)
- **Throttling** - Frequent events throttled (100ms)
- **Memoization** - Expensive calculations cached
- **Virtual Scrolling** - Large lists optimized for performance

### **Memory Management**
- **Automatic Cleanup** - Memory leaks prevented with proper cleanup
- **Garbage Collection** - Manual GC triggers for heavy operations
- **Component Unmounting** - Proper cleanup on component unmount
- **Event Listener Management** - Listeners properly removed

### **Asset Optimization**
- **Image Optimization** - WebP format with fallbacks
- **Font Loading** - Optimized font loading strategies
- **CSS Optimization** - Purged unused styles
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