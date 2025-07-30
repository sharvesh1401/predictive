# 🔑 API Key Configuration Guide

## Overview

The EV Routing Simulation Tool is designed to work **with or without API keys** through graceful degradation. This ensures the application remains functional while encouraging proper security practices.

## 🚀 How It Works

### **With API Keys (Full Functionality)**
When all API keys are properly configured, you get:
- ✅ **Interactive Maps**: Full Mapbox integration with real-time map data
- ✅ **AI Navigation**: DeepSeek and Groq AI-powered route optimization
- ✅ **Real-time Data**: Live charging station data and traffic information
- ✅ **Advanced Features**: All premium features enabled

### **Without API Keys (Limited Functionality)**
When API keys are not configured, you get:
- ✅ **Mock Data**: Realistic simulation data for testing
- ✅ **Basic Routing**: Dijkstra and A* algorithms work with mock data
- ✅ **UI Functionality**: All user interface features work normally
- ✅ **Development Mode**: Perfect for development and testing

## 🔧 Configuration Options

### **Option 1: Full Setup (Recommended)**
```bash
# Copy the example file
cp env.example .env.local

# Edit .env.local with your actual keys
REACT_APP_MAPBOX_TOKEN=pk.your_actual_mapbox_token
REACT_APP_DEEPSEEK_API_KEY=sk-your_actual_deepseek_key
REACT_APP_GROQ_API_KEY=gsk_your_actual_groq_key
```

### **Option 2: Partial Setup**
```bash
# Only configure some keys
REACT_APP_MAPBOX_TOKEN=pk.your_actual_mapbox_token
# Leave others unset for fallback behavior
```

### **Option 3: No Keys (Development)**
```bash
# Don't create .env.local
# App will use mock data and show warnings
```

## 📊 Feature Matrix

| Feature | With API Keys | Without API Keys |
|---------|---------------|------------------|
| **Interactive Maps** | ✅ Full Mapbox | ⚠️ Limited (placeholder) |
| **AI Navigation** | ✅ DeepSeek + Groq | ⚠️ Mock AI responses |
| **Real Charging Data** | ✅ Live data | ⚠️ Mock stations |
| **Traffic Information** | ✅ Real-time | ⚠️ Simulated |
| **Route Optimization** | ✅ AI-powered | ✅ Algorithm-based |
| **User Interface** | ✅ Full features | ✅ Full features |
| **Security Monitoring** | ✅ Active | ✅ Active |

## 🛡️ Security Features (Always Active)

Regardless of API key configuration, these security features are always active:

- ✅ **Input Validation**: All user inputs are sanitized
- ✅ **XSS Protection**: No innerHTML with unsanitized data
- ✅ **Rate Limiting**: Request throttling and monitoring
- ✅ **Error Handling**: Secure error messages
- ✅ **Security Monitoring**: Real-time security tracking
- ✅ **Encryption**: AES-256-GCM for stored data

## 🔍 How to Check Configuration Status

### **In the Application**
1. **Security Status Indicator**: Look for the security badge in the top-right corner
2. **Console Warnings**: Check browser console for configuration messages
3. **Feature Availability**: Some features will show "not configured" messages

### **Programmatically**
```javascript
// Check API key status
const apiKeyStatus = secureAPIService.validateAPIKeys();
console.log('API Key Status:', apiKeyStatus);

// Check specific service availability
const hasMapbox = apiKeyStatus.mapbox?.valid;
const hasDeepSeek = apiKeyStatus.deepseek?.valid;
const hasGroq = apiKeyStatus.groq?.valid;
```

## 🚨 Warning Messages

### **No API Keys Configured**
```
⚠️ No API keys configured. Some features will be limited.
```

### **Partial Configuration**
```
⚠️ Mapbox API key not configured. Map functionality will be limited.
⚠️ DeepSeek API key not configured. AI navigation will use fallback.
```

### **Invalid API Keys**
```
❌ Some API keys are invalid. Please check configuration.
```

## 🎯 Use Cases

### **Production Deployment**
- **Required**: All API keys configured
- **Benefits**: Full functionality, real data, AI features
- **Security**: Maximum security with encrypted keys

### **Development/Testing**
- **Optional**: No API keys needed
- **Benefits**: Fast setup, mock data, no costs
- **Security**: All security features still active

### **Demo/Presentation**
- **Optional**: Partial API key configuration
- **Benefits**: Some real features, some mock data
- **Security**: Full security monitoring

## 🔄 Migration Path

### **From No Keys to Full Setup**
1. Start with no keys (app works with mock data)
2. Gradually add API keys as needed
3. Test each service individually
4. Monitor security status

### **From Development to Production**
1. Configure all required API keys
2. Test all features thoroughly
3. Set up monitoring and alerts
4. Deploy with full security

## 📝 Best Practices

### **Development**
- Use mock data for initial development
- Add API keys incrementally
- Test both with and without keys
- Monitor console for warnings

### **Production**
- Always configure all API keys
- Use environment variables
- Rotate keys regularly
- Monitor usage and security

### **Security**
- Never commit API keys to version control
- Use secure secret management
- Monitor for suspicious activity
- Keep security documentation updated

## 🆘 Troubleshooting

### **App Not Loading**
- Check browser console for errors
- Verify environment variable syntax
- Ensure no hardcoded keys in source

### **Features Not Working**
- Check API key configuration status
- Verify API key validity
- Review network requests in browser

### **Security Warnings**
- Review security status indicator
- Check security monitoring logs
- Verify encryption is working

---

**🎯 Goal**: The application should work seamlessly whether you have API keys configured or not, while maintaining maximum security in all scenarios. 