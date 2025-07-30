# 🚀 Single-Click Deployment Guide

This guide provides multiple deployment options for the EV Routing Simulation Tool, all designed for single-click deployment.

## 🎯 Quick Deploy Options

### 1. **Vercel (Recommended - Single Click)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sharvesh1401/ev-routing-simulation&env=REACT_APP_MAPBOX_TOKEN,REACT_APP_DEEPSEEK_API_KEY,REACT_APP_GROQ_API_KEY&envDescription=API%20Keys%20for%20the%20application&envLink=https://github.com/sharvesh1401/ev-routing-simulation#environment-variables)

**Steps:**
1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account
3. Configure environment variables (optional - defaults provided)
4. Click "Deploy"
5. Your app will be live in 2-3 minutes!

### 2. **Netlify (Single Click)**

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/sharvesh1401/ev-routing-simulation)

**Steps:**
1. Click the "Deploy to Netlify" button
2. Connect your GitHub account
3. Click "Deploy site"
4. Your app will be live in 2-3 minutes!

### 3. **Railway (Single Click)**

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/new?template=https://github.com/sharvesh1401/ev-routing-simulation)

**Steps:**
1. Click the "Deploy on Railway" button
2. Connect your GitHub account
3. Click "Deploy"
4. Your app will be live in 2-3 minutes!

## 🐳 Docker Deployment

### Local Docker Deployment

```bash
# Clone the repository
git clone https://github.com/sharvesh1401/ev-routing-simulation.git
cd ev-routing-simulation/frontend

# Build and run with Docker Compose
docker-compose up -d

# Your app will be available at http://localhost
```

### Production Docker Deployment

```bash
# Build the production image
docker build -t ev-routing-simulation .

# Run the container
docker run -d -p 80:80 --name ev-routing-app ev-routing-simulation

# Your app will be available at http://localhost
```

## ☁️ Cloud Platform Deployment

### AWS Amplify

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Connect your GitHub repository
4. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: build
       files:
         - '**/*'
   ```
5. Click "Save and deploy"

### Google Cloud Run

```bash
# Build and deploy to Cloud Run
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/ev-routing-simulation
gcloud run deploy ev-routing-simulation --image gcr.io/YOUR_PROJECT_ID/ev-routing-simulation --platform managed --allow-unauthenticated
```

### Azure Static Web Apps

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new "Static Web App"
3. Connect your GitHub repository
4. Configure build settings:
   - Build Preset: React
   - App location: `/frontend`
   - Output location: `build`
5. Click "Review + create"

## 🔧 Environment Variables

The application includes default API keys for immediate deployment. For production use, consider setting your own:

```bash
# Required Environment Variables
REACT_APP_MAPBOX_TOKEN=your_mapbox_token
REACT_APP_DEEPSEEK_API_KEY=your_deepseek_api_key
REACT_APP_GROQ_API_KEY=your_groq_api_key

# Optional Environment Variables
REACT_APP_API_URL=https://your-backend-url.com
REACT_APP_ENABLE_PWA=true
REACT_APP_ENABLE_ANALYTICS=false
```

## 📱 PWA Features

The application includes Progressive Web App (PWA) features:

- **Offline Support**: Works without internet connection
- **Installable**: Can be installed on mobile devices
- **Push Notifications**: Real-time updates (if configured)
- **App-like Experience**: Full-screen mode and native feel

## 🔒 Security Features

- **HTTPS Only**: All deployments use HTTPS
- **Security Headers**: XSS protection, content type validation
- **Rate Limiting**: API request throttling
- **CORS Configuration**: Proper cross-origin settings

## 📊 Performance Optimizations

- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: WebP format with fallbacks
- **Gzip Compression**: Reduced file sizes
- **CDN Distribution**: Global content delivery

## 🚀 Deployment Checklist

Before deploying, ensure:

- [ ] All tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Environment variables are configured
- [ ] API keys are valid
- [ ] Domain is configured (if custom)
- [ ] SSL certificate is active
- [ ] Monitoring is set up

## 🔍 Post-Deployment Verification

After deployment, verify:

1. **Homepage loads** at your domain
2. **Map displays** correctly
3. **Simulation works** with sample data
4. **AI navigation** responds
5. **Mobile responsiveness** works
6. **PWA installation** works
7. **Offline functionality** works

## 🆘 Troubleshooting

### Common Issues

**Build Fails:**
```bash
# Clear cache and rebuild
npm run clean
npm install
npm run build
```

**Map Not Loading:**
- Verify Mapbox token is valid
- Check browser console for errors
- Ensure HTTPS is enabled

**AI Navigation Not Working:**
- Verify API keys are correct
- Check network connectivity
- Review browser console for errors

### Support

For deployment issues:
1. Check the [GitHub Issues](https://github.com/sharvesh1401/ev-routing-simulation/issues)
2. Review the [Documentation](https://github.com/sharvesh1401/ev-routing-simulation#readme)
3. Contact: sharvesh1401@gmail.com

## 🎉 Success!

Your EV Routing Simulation Tool is now live and ready to use! 

**Next Steps:**
- Share your deployment URL
- Configure custom domain (optional)
- Set up monitoring and analytics
- Customize branding and features

---

**Happy Deploying! 🚀** 