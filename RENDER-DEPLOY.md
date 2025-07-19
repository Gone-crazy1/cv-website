# 🚀 Deploy Sofi AI Backend to Render.com

## Quick Deploy Instructions

### 1. **Create New Web Service on Render.com**
- Go to [render.com](https://render.com)
- Click "New" → "Web Service"
- Connect your GitHub account
- Select your `cv-website` repository

### 2. **Configure Deployment Settings**
```
Service Name: sofi-ai-backend
Environment: Node
Build Command: npm install
Start Command: npm start
```

### 3. **Environment Variables**
Add these in Render.com dashboard:
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=10000
NODE_ENV=production
ALLOWED_ORIGINS=https://oluwaseun.dev,http://localhost:3000
```

### 4. **Custom Domain Setup (Optional)**
If you want to use ai.oluwaseun.dev:
1. Add custom domain in Render settings
2. Update DNS A record to point to Render IP
3. Update API URL in script.js

### 5. **Auto-Deploy**
- Render will automatically deploy when you push to GitHub
- Your backend will be available at: `https://sofi-ai-backend.onrender.com`

### 6. **Test Deployment**
Visit: `https://sofi-ai-backend.onrender.com/api/health`
Should return: `{"status":"healthy","timestamp":"..."}`

## 🔧 **Your Current Setup:**
- **Frontend**: oluwaseun.dev (your main website)
- **AI Backend**: sofi-ai-backend.onrender.com
- **API Endpoint**: `/api/chat`
- **Health Check**: `/api/health`

The AI is now **prominently positioned** at the top-right with:
- ✅ Larger, more colorful button (70px)
- ✅ Eye-catching gradient colors
- ✅ Pulsing animation to draw attention
- ✅ "Ask AI" badge that bounces
- ✅ Enhanced chat interface
- ✅ Better mobile responsiveness
